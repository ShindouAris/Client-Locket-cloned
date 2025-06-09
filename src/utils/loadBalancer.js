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
  }

  async initialize() {
    await this.updateHealthyNodes();
    // Start periodic health checks
    setInterval(() => this.updateHealthyNodes(), this.healthCheckInterval);
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

    const responseTimeScore = -avgResponseTime;
    const ramScore = stats.freeRAM * 0.4; 
    const cpuScore = -(stats.cpuUsage * 0.4);
    
    return responseTimeScore + ramScore + cpuScore;
  }

  async updateHealthyNodes() {
    const allNodes = getBackendNodes();
    const now = Date.now();
    
    if (now - this.lastHealthCheck < this.healthCheckInterval) {
      return;
    }
    
    this.lastHealthCheck = now;
    this.healthyNodes = [];

    await Promise.all(allNodes.map(async (node) => {
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
      this.healthyNodes = allNodes;
      console.warn('All backend nodes are down! Falling back to all nodes.');
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

  async getBestNodes(count = 3) {
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
    return sortedNodes.slice(0, Math.min(count, sortedNodes.length));
  }
}

// Create a singleton instance
const loadBalancer = new LoadBalancer();
loadBalancer.initialize();

export default loadBalancer; 