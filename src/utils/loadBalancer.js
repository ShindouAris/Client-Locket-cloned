import { getBackendNodes } from './backendConfig';

class LoadBalancer {
  constructor() {
    this.currentNodeIndex = 0;
    this.healthyNodes = [];
    this.unhealthyNodes = new Set();
    this.lastHealthCheck = 0;
    this.healthCheckInterval = 30000; // 30 seconds
  }

  async initialize() {
    await this.updateHealthyNodes();
    // Start periodic health checks
    setInterval(() => this.updateHealthyNodes(), this.healthCheckInterval);
  }

  async updateHealthyNodes() {
    const allNodes = getBackendNodes();
    const now = Date.now();
    
    // Skip health check if it was done recently
    if (now - this.lastHealthCheck < this.healthCheckInterval) {
      return;
    }
    
    this.lastHealthCheck = now;
    this.healthyNodes = [];

    // Check health of all nodes
    await Promise.all(allNodes.map(async (node) => {
      try {
        const response = await fetch(`${node}/keepalive`, {
          method: 'GET',
          timeout: 5000
        });
        
        if (response.ok) {
          this.healthyNodes.push(node);
          this.unhealthyNodes.delete(node);
        } else {
          this.unhealthyNodes.add(node);
        }
      } catch (error) {
        console.warn(`Backend node ${node} is unhealthy:`, error);
        this.unhealthyNodes.add(node);
      }
    }));

    // If all nodes are down, try to recover some nodes
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
}

// Create a singleton instance
const loadBalancer = new LoadBalancer();
loadBalancer.initialize();

export default loadBalancer; 