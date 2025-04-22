// /src/utils/cookieUtils.js

export function setSession(sname, svalue, exp) {
    if (!svalue) {
        console.error(`setSession: Value for ${sname} is undefined!`);
        return;
    }
    
    const d = new Date();
    d.setTime(d.getTime() + exp * 60000);
    document.cookie = `${sname}=${encodeURIComponent(svalue)};expires=${d.toUTCString()};path=/;SameSite=Lax`;
}


export function getSession(sname) {
    const nameEQ = sname + "=";
    const cookies = decodeURIComponent(document.cookie).split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(nameEQ) === 0) return cookie.substring(nameEQ.length, cookie.length);
    }
    return null;
}

export function clearSession(sname) {
    document.cookie = `${sname}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=None;Secure`;
    
}
