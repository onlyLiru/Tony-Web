let heartbeatTimeout;

self.onmessage = function(e) {
    if (e.data === 'start') {
        clearTimeout(heartbeatTimeout);
        heartbeatTimeout = setTimeout(function() {
            self.postMessage('heartbeat');
        }, 40000);  // 40秒后发送一次心跳
    } else if (e.data === 'stop') {
        clearTimeout(heartbeatTimeout);
    }
};