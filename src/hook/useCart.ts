import api from "../lib/api";

// let authkey = localStorage.getItem("authKey");


export const getCartData = async () => {
    const authkey = localStorage.getItem("authKey"); // always fetch latest here
    if (!authkey) throw new Error("No auth key found");

    const res = await api.post(
        "userauth/getusercarts",
        {},
        { headers: { "auth_key": authkey } }
    );
    return res.data;
}

export const getAllAddress = async () => {
    const authkey = localStorage.getItem("authKey"); // always fetch latest here
    const res = await api.post(
        "userauth/getappuseraddress",
        {}, // empty body
        { headers: { "auth_key": authkey } }
    );
    return res.data;
};