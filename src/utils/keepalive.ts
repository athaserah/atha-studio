class KeepAlive {
  private interval: NodeJS.Timeout | null = null;
  private heartbeatInterval = 30000; // 30 seconds
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private isActive = false;

  constructor() {
    this.bindEvents();
  }

  private bindEvents() {
    // Listen for visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    });

    // Listen for online/offline events
    window.addEventListener('online', () => {
      console.log('🟢 Connection restored');
      this.resume();
    });

    window.addEventListener('offline', () => {
      console.log('🔴 Connection lost');
      this.pause();
    });

    // Handle page unload
    window.addEventListener('beforeunload', () => {
      this.stop();
    });
  }

  private async sendHeartbeat() {
    try {
      // Send a simple ping to keep the connection alive
      const response = await fetch(window.location.origin + '/favicon.ico', {
        method: 'HEAD',
        cache: 'no-cache'
      });

      if (response.ok) {
        this.reconnectAttempts = 0;
        console.log('💓 Heartbeat sent successfully');
      } else {
        throw new Error('Heartbeat failed');
      }
    } catch (error) {
      console.warn('❗ Heartbeat failed:', error);
      this.handleHeartbeatFailure();
    }
  }

  private handleHeartbeatFailure() {
    this.reconnectAttempts++;
    
    if (this.reconnectAttempts <= this.maxReconnectAttempts) {
      console.log(`🔄 Attempting reconnect ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      
      // Exponential backoff
      const backoffTime = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      setTimeout(() => this.sendHeartbeat(), backoffTime);
    } else {
      console.error('🚫 Max reconnection attempts reached');
      this.stop();
    }
  }

  start() {
    if (this.isActive) return;
    
    this.isActive = true;
    this.reconnectAttempts = 0;
    
    console.log('🚀 KeepAlive started');
    
    // Send initial heartbeat
    this.sendHeartbeat();
    
    // Set up interval
    this.interval = setInterval(() => {
      if (!document.hidden && navigator.onLine) {
        this.sendHeartbeat();
      }
    }, this.heartbeatInterval);
  }

  pause() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isActive = false;
    console.log('⏸️ KeepAlive paused');
  }

  resume() {
    if (!this.isActive && navigator.onLine) {
      this.start();
    }
  }

  stop() {
    this.pause();
    this.reconnectAttempts = 0;
    console.log('🛑 KeepAlive stopped');
  }

  // Update heartbeat interval (in milliseconds)
  setHeartbeatInterval(interval: number) {
    if (interval < 5000) {
      console.warn('⚠️ Heartbeat interval too short, minimum is 5 seconds');
      return;
    }
    
    this.heartbeatInterval = interval;
    
    if (this.isActive) {
      this.stop();
      this.start();
    }
  }

  getStatus() {
    return {
      isActive: this.isActive,
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts,
      heartbeatInterval: this.heartbeatInterval,
      isOnline: navigator.onLine,
      isVisible: !document.hidden
    };
  }
}

// Create singleton instance
export const keepAlive = new KeepAlive();

// Auto-start when the module is imported
if (typeof window !== 'undefined') {
  // Start after a short delay to ensure page is loaded
  setTimeout(() => {
    keepAlive.start();
  }, 1000);
}
