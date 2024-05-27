const express = require('express');
const { Client, NoAuth, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const router = express.Router();

const client = new Client({
  authStrategy: new LocalAuth(),
  webVersionCache: {
    type: "remote",
    remotePath:
      "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
  },
});

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.initialize();

/* GET home page. */
router.get('/', function (req, res, next) {
  return res.send('Backend Active');
});

router.post('/send', async (req, res) => {
  console.log(req.body);
  try {
    const state = client.getState();
    const statePromise = new Promise((resolve, reject) => {
      resolve(state);
    });
    statePromise.then(async (value) => {
      if (value === 'CONNECTED') {
        client.sendMessage(req.body.phone, `*${req.body.judul} BARANG*\n\n*Nama :* ${req.body.name}\n*Kelas :* ${req.body.kelas}\n*Keperluan :* ${req.body.keperluan}\n*Status :* ${req.body.pesan}\n\nSudah berhasil tercatat pada database, jangan lupa untuk konfirmasi dalam peminjaman/pengembalian. Qr-Code bisa dipindai kembali jika akan dikembalikan..`);
        return res.json({
          status: true,
        });
      }
    })
      .catch((error) => {
        return res.json({
          status: false
        })
      })
  } catch (error) {
    return res.json({
      status: false
    })
  }
});

module.exports = router;
