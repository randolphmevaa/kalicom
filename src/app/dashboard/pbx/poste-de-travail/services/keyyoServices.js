// services/keyyoService.js
let cti = null;

export const initializeKeyyo = () => {
  if (typeof window !== 'undefined' && window.Keyyo) {
    cti = new window.Keyyo.CTI();
  }
  return cti;
};

export const authUrl = `https://ssl.keyyo.com/oauth2/authorize.php?client_id=67e1f96262f4c&redirect_uri=${encodeURIComponent('https://kalicom.vercel.app/dashboard/acceuil')}&response_type=code`;

export const getAccessToken = async (authCode) => {
  const tokenResponse = await fetch('https://api.keyyo.com/oauth2/token.php', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({
      client_id: '67e1f96262f4c',
      client_secret: 'b9b83284780d5463fa1a1ff2',
      grant_type: 'authorization_code',
      code: authCode,
      redirect_uri: 'https://kalicom.vercel.app/dashboard/acceuil'
    })
  });
  return await tokenResponse.json();
};

// Add CSI token retrieval function here once documentation is available
export const getCSIToken = async ( ) => {
  // Implement based on Keyyo documentation
};

export const connectToCTI = (csiToken, callbacks) => {
  if (!cti) initializeKeyyo();
  
  return new Promise((resolve, reject) => {
    cti.create_session(csiToken, (err, res) => {
      if (err) {
        console.error('CTI connection error:', err);
        reject(err);
        return;
      }
      console.log('Connected to Keyyo CTI');
      setupCallHandlers(callbacks);
      resolve(res);
    });
  });
};

const setupCallHandlers = ({ 
  onNewCall, 
  onCallSetup, 
  onCallConnect, 
  onCallRelease, 
  onCallMissed
}) => {
  cti.onNewCall = function(call) {
    if (onNewCall) onNewCall(call);
    
    call.onSetup = () => {
      if (onCallSetup) onCallSetup(call);
    };
    
    call.onConnect = () => {
      if (onCallConnect) onCallConnect(call);
    };
    
    call.onRelease = () => {
      if (onCallRelease) onCallRelease(call);
    };
    
    call.onMissed = () => {
      if (onCallMissed) onCallMissed(call);
    };
  };
};

export const makeCall = (number) => {
  return new Promise((resolve, reject) => {
    if (!cti) {
      reject(new Error('CTI not initialized'));
      return;
    }
    
    cti.dial(number, (err, res) => {
      if (err) {
        console.error('Error making call:', err);
        reject(err);
        return;
      }
      resolve(res);
    });
  });
};

// Add more API methods here
export const hangUpCall = (call) => {
  return new Promise((resolve, reject) => {
    call.hang_up((err, res) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(res);
    });
  });
};

export const answerCall = ( ) => {
  // Implementation
};

export const holdCall = ( ) => {
  // Implementation
};

export const transferCall = ( ) => {
  // Implementation
};

export const getCallHistory = () => {
  if (!cti) return [];
  return cti.get_calls();
};
