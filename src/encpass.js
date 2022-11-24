const util = require("./nacl-util");
const nacl = require("./nacl-fast.js");
const blake = require("blakejs/blake2b");
const aes = require("js-crypto-aes");
const crypto = require("crypto");

const overheadLength = nacl.box.publicKeyLength + nacl.box.overheadLength;

function nonceGenerator(pk1, pk2) {
  var state = blake.blake2bInit(nacl.box.nonceLength, null);
  blake.blake2bUpdate(state, pk1);
  blake.blake2bUpdate(state, pk2);
  return blake.blake2bFinal(state);
}

function seal(m, pk) {
  var c = new Uint8Array(overheadLength + m.length);

  var ek = nacl.box.keyPair();

  c.set(ek.publicKey);

  var nonce = nonceGenerator(ek.publicKey, pk);

  var boxed = nacl.box(m, nonce, pk, ek.secretKey);
  c.set(boxed, ek.publicKey.length);

  return c;
}

async function encpass(pwd, timeStamp, publicKey, keyId) {
  var h = "#PWD_BROWSER";
  var i = "5";
  var pwd = util.decodeUTF8(pwd);
  var iv = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  var additionalData = util.decodeUTF8(timeStamp);
  var Aes_gcm_key = new Uint8Array(crypto.randomBytes(32));

  var encrypted = await aes.encrypt(pwd, Aes_gcm_key, {
    name: "AES-GCM",
    iv,
    additionalData,
    tagLength: 16,
  });

  var Aes_gcm_ciphertext = new Uint8Array(encrypted);

  var publicKey = new Uint8Array(Buffer.from(publicKey, "hex"));

  var a = keyId; //keyId
  var i = 5,
    j = 1,
    k = 1,
    l = 1,
    m = 2,
    n = 32,
    o = 16,
    p = k + l + m + n + overheadLength + o;

  var g = p + pwd.length;
  var t = new Uint8Array(g);
  var u = 0;
  t[u] = j;
  u += k;
  t[u] = a;
  u += l;

  var b = seal(Aes_gcm_key, publicKey);
  t[u] = b.length & 255;
  t[u + 1] = (b.length >> 8) & 255;
  u += m;
  t.set(b, u);
  u += n;
  u += overheadLength;
  if (b.length !== n + overheadLength) {
    return "encrypted key is the wrong length";
  }

  b = new Uint8Array(Aes_gcm_ciphertext);
  a = b.slice(-o);
  b = b.slice(0, -o);
  t.set(a, u);
  u += o;
  t.set(b, u);

  var encpass = [h, i, timeStamp, util.encodeBase64(t)].join(":");

  return encpass;
}

module.exports = encpass;
