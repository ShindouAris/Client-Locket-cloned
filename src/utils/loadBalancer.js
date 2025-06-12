import { getBackendNodes } from './backendConfig';

class LoadBalancer {
  constructor() {
    this.currentNodeIndex = 0;
    this.healthyNodes = [];
    this.unhealthyNodes = new Set();
    this.lastHealthCheck = 0;
    this.healthCheckInterval = 30000; // 30 seconds
    this.nodePerformance = new Map(); // Track response times
    this.performanceWindow = 5; // Number of samples to keep
    this.nodeStats = new Map(); // Track system stats
    this.activeNodePool = new Set(); // Track currently active nodes
    this.maxActiveNodes = 5; // Maximum number of nodes to keep active at once
  }

  async initialize() {
    await this.updateActiveNodePool();
    // Start periodic health checks
    setInterval(() => this.updateActiveNodePool(), this.healthCheckInterval);
  }

  async updateActiveNodePool() {
    const allNodes = getBackendNodes();
    
    // If we have fewer nodes than max, use all of them
    if (allNodes.length <= this.maxActiveNodes) {
      this.activeNodePool = new Set(allNodes);
      await this.updateHealthyNodes();
      return;
    }

    // Keep some existing good performers if we have them
    const existingGoodNodes = [...this.activeNodePool].filter(node => 
      !this.unhealthyNodes.has(node) && 
      this.getAverageResponseTime(node) < 1000
    ).slice(0, Math.floor(this.maxActiveNodes / 2));

    // Fill remaining slots with random nodes we haven't tried recently
    const remainingSlots = this.maxActiveNodes - existingGoodNodes.length;
    const unusedNodes = allNodes.filter(node => 
      !this.activeNodePool.has(node) || 
      this.unhealthyNodes.has(node)
    );
    
    // Randomly select remaining nodes
    const newNodes = [];
    while (newNodes.length < remainingSlots && unusedNodes.length > 0) {
      const randomIndex = Math.floor(Math.random() * unusedNodes.length);
      newNodes.push(unusedNodes.splice(randomIndex, 1)[0]);
    }

    // Update active pool
    this.activeNodePool = new Set([...existingGoodNodes, ...newNodes]);
    await this.updateHealthyNodes();
  }

  updateNodePerformance(node, responseTime) {
    if (!this.nodePerformance.has(node)) {
      this.nodePerformance.set(node, []);
    }
    const times = this.nodePerformance.get(node);
    times.push(responseTime);
    // Keep only the last N samples
    if (times.length > this.performanceWindow) {
      times.shift();
    }
    this.nodePerformance.set(node, times);
  }

  getAverageResponseTime(node) {
    const times = this.nodePerformance.get(node) || [];
    if (times.length === 0) return Infinity;
    return times.reduce((a, b) => a + b, 0) / times.length;
  }

  async getNodeStats(node) {
    try {
      const response = await fetch(`${node}/stat`, {
        method: 'GET',
        timeout: 5000
      });
      if (response.ok) {
        const stats = await response.json();
        this.nodeStats.set(node, stats);
        return stats;
      }
    } catch (error) {
      console.warn(`Failed to get stats for node ${node}:`, error);
    }
    return null;
  }

  calculateNodeScore(node) {
    const avgResponseTime = this.getAverageResponseTime(node);
    const stats = this.nodeStats.get(node);
    
    if (!stats) {
      return -avgResponseTime; 
    }
  
    // Tính theo tỉ lệ RAM container được cấp phát
    const ramRatio = Math.min(stats.freeRAM / stats.totalRAM, 1.0); // tránh over 100%
    const ramScore = ramRatio * 100; // Tối đa 100 điểm từ RAM
  
    const cpuScore = -(stats.cpuUsage * 0.4); // giữ nguyên
    const responseTimeScore = -avgResponseTime; // giữ nguyên
  
    return responseTimeScore + ramScore + cpuScore;
  }

  async updateHealthyNodes() {
    const now = Date.now();
    if (now - this.lastHealthCheck < this.healthCheckInterval) {
      return;
    }
    
    this.lastHealthCheck = now;
    this.healthyNodes = [];

    await Promise.all([...this.activeNodePool].map(async (node) => {
      try {
        const startTime = Date.now();
        const [healthResponse, stats] = await Promise.all([
          fetch(`${node}/keepalive`, {
            method: 'GET',
            timeout: 5000
          }),
          this.getNodeStats(node)
        ]);
        const responseTime = Date.now() - startTime;
        
        if (healthResponse.ok) {
          this.healthyNodes.push(node);
          this.unhealthyNodes.delete(node);
          this.updateNodePerformance(node, responseTime);
        } else {
          this.unhealthyNodes.add(node);
        }
      } catch (error) {
        console.warn(`Backend node ${node} is unhealthy:`, error);
        this.unhealthyNodes.add(node);
      }
    }));

    if (this.healthyNodes.length === 0) {
      await this.updateActiveNodePool(); // Try to get a new set of nodes
      if (this.healthyNodes.length === 0) {
        this.healthyNodes = [...this.activeNodePool]; // Last resort fallback
      }
    }
  }

  getNextNode() {
    if (this.healthyNodes.length === 0) {
      throw new Error('No healthy backend nodes available');
    }

    // Round-robin selection
    const node = this.healthyNodes[this.currentNodeIndex];
    this.currentNodeIndex = (this.currentNodeIndex + 1) % this.healthyNodes.length;
    return node;
  }

  async getHealthyNode() {
    // Update nodes if we haven't done so recently
    if (Date.now() - this.lastHealthCheck >= this.healthCheckInterval) {
      await this.updateHealthyNodes();
    }
    return this.getNextNode();
  }

  async getBestNodes() {
    // Update nodes if needed
    if (Date.now() - this.lastHealthCheck >= this.healthCheckInterval) {
      await this.updateHealthyNodes();
    }

    // Sort healthy nodes by their overall score
    const sortedNodes = [...this.healthyNodes].sort((a, b) => {
      const scoreA = this.calculateNodeScore(a);
      const scoreB = this.calculateNodeScore(b);
      return scoreB - scoreA; // Higher score is better
    });

    // Return the requested number of best performing nodes
    return sortedNodes.slice(0, Math.min(1, sortedNodes.length));
  }
}

// Create a singleton instance
const loadBalancer = new LoadBalancer();
loadBalancer.initialize();

export default loadBalancer; 