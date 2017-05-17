const BASE_URL = '';

const GET = 'GET';
const POST = 'POST';
const PUT = 'PUT';
const DELETE = 'DELETE';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

class ApiUtils {

  async login(code, password) {
    const result = await this._sendLogin(POST, 'https://www.courriel.uqam.ca/iwc/svc/iwcp/login.iwc', { code, password });
    return result;
  }

  async getEmails(token, start) {
    let debut = 0;
    if (start) {
      debut = start;
    }
    let params = {
      rev:3,
      sid:'',
      mbox:'INBOX',
      count: 25 + debut,
      date:true,
      lang:'recv',
      sortby:'recv',
      sortorder:'R',
      start: 0,
      srch:'UNDELETED',
      token: token,
    }
    //dojo.preventCache:1494736400578
    const result = await this._send(GET, 'https://www.courriel.uqam.ca/iwc/svc/wmap/mbox.mjs', params);
    return result;
  }

  async getMessage(token, id) {
    let params = {
      rev:3,
      sid:'',
      mbox:'INBOX',
      lang:'fr',
      uid:id,
      security: false,
      token: token,
    }
    const result = await this._send(GET, 'https://www.courriel.uqam.ca/iwc/svc/wmap/msg.mjs', params);
    return result;
  }

  /**
  * General method that sends requests to the server.
  */
  async _send(method: Method, url: string, params?: Object) {
    const headers: Object = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    let finalURL = BASE_URL + url;
    let body;
    if (params) {
      if (method === 'GET') {
        finalURL += this._toQueryString(params);
      } else {
        body = params;
      }
    }
    const response = await fetch(finalURL, {
      method,
      headers,
      body,
    });
    return response;

    if (response.status !== 200) {
      try {
        const error = await response.json();
        console.log(error);
      } catch (err) {
        console.log(err);
      }

    }
    try {
      const resObject = await response.json();
      return resObject;
    } catch (err) {
      console.log(err);
    }
    return null;
  }

  async _sendLogin(method: Method, url: string, params?: Object) {
    const headers: Object = {
      Accept: '*/*',
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Requested-With': 'XMLHttpRequest',
      'Accept-Language':'fr-FR,fr;q=0.8,en-US;q=0.6,en;q=0.4',
      'User-Agent':'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
      'Referer': 'https://www.courriel.uqam.ca/iwc_static/c11n/allDomain/layout/login.html?lang=fr&2-7.01_091006&svcs=abs,mail,c11n',
      'Origin':'https://www.courriel.uqam.ca',
      'Host':'www.courriel.uqam.ca',
      'Cookie':'iwc-prefs=lang=fr; iwc-prelogin=preloginip=132.208.246.246',
      // 'Accept-Encoding':'gzip, deflate, br',
    };

    let finalURL = BASE_URL + url;
    let body;
    if (params) {
      if (method === 'GET') {
        finalURL += this._toQueryString(params);
      } else {
        //body = JSON.stringify(params);
        body = 'username='+params.code+'&password='+params.password+'&token=badvalue&fmt-out=text%2Fjson&dojo.preventCache=1494660359077';
      }
    }
    const response = await fetch(finalURL, {
      method,
      headers,
      body,
    });

    if (response.status !== 200) {
      try {
        const error = await response.json();
        console.log(error);
      } catch (err) {
        console.log(err);
      }

    }
    try {
      const resObject = await response.json();
      return resObject;
    } catch (err) {
      console.log(err);
    }
    return null;
  }

  /**
   * Convert an object to a query string.
   */
  _toQueryString(params: Object): string {
    let result = '?';
    for (const [key, value] of Object.entries(params)) {
      // $FlowFixMe
      result += `${encodeURIComponent(key)}=${encodeURIComponent(value)}&`;
    }
    return result.slice(0, -1);
  }
}

export default new ApiUtils();
