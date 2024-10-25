const express = require('express');
const router = express.Router();

const fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pages/index', { title: 'SA-CHAOS', page : 'home' });
});

router.get('/general-config', function(req, res, next) {
  res.render('pages/general-config', { title: 'General Config', page : 'general-config' });
});

router.get('/tiktok-config', function(req, res, next) {
  res.render('pages/tiktok-config', { title: 'Tiktok Config', page : 'tiktok-config' });
})

router.get('/gift-config', function(req, res, next) {
  res.render('pages/gift-config', { title: 'Gift Config', page : 'gift-config' });
})

router.get('/new-gift-config', function(req, res, next) {
  res.render('pages/new-gift-config', { title: 'New Gift Config', page : 'new-gift-config' });
})

router.get('/spinwheel-config', function(req, res, next) {
  res.render('pages/spinwheel-config', { title: 'Spinwheel Config', page : 'spinwheel-config' });
})

router.get('/config', function(req, res, next) {
  let Config = JSON.parse(fs.readFileSync(__dirname + "/../../config.json", "utf8"));
  res.json(Config);
});

router.get('/gifts', function(req, res, next) {
  let Gifts = JSON.parse(fs.readFileSync(__dirname + "/../../gifts.json", "utf8"));
  let Image = JSON.parse(fs.readFileSync(__dirname + "/../../gift-img.json", "utf8"));
  Gifts.forEach((item) => {
    item.images = Image.find((img) => img.id === item.id);
  })
  res.json(Gifts);
});

router.get('/spinnwheel-effects', function(req, res, next) {
  if(fs.existsSync(__dirname + "/../../spinwheel-effects.json") && fs.readFileSync(__dirname + "/../../spinwheel-effects.json", "utf8") != "{}") {
    let Effects = JSON.parse(fs.readFileSync(__dirname + "/../../spinwheel-effects.json", "utf8"));
    res.json(Effects);
  } else if (JSON.parse(fs.readFileSync(__dirname + "/../../spinwheel-effects.json", "utf8")) == {}) {
    res.json({status: "error", message: "Effects not found"});
  }
  else {
    res.json({status: "error", message: "Spinwheel effects not found"});
  }
})

router.get('/effects', function(req, res, next) {
  let Effects = JSON.parse(fs.readFileSync(__dirname + "/../../effects.json", "utf8"));
  res.json(Effects);
})

router.post('/handle-tiktok-config', function(req, res, next) {
  let Config = JSON.parse(fs.readFileSync(__dirname + "/../../config.json", "utf8"));
  let Tiktok = Config.Tiktok;
  if(req.body["enable-tiktok"] != undefined)
    Tiktok.TiktokEnable = req.body["enable-tiktok"] === 'true';
  if(req.body["enable-tikfinity"] != undefined)
    Tiktok.TikfinityEnable = req.body["enable-tikfinity"] === 'true';
  if(req.body["enable-tikfinity-http"] != undefined)
    Tiktok.TikfinityHTTPServer = req.body["enable-tikfinity-http"] === 'true';
  if(req.body["enable-build-in-chaos"] != undefined)
    Tiktok.TiktokUseBuiltInChaos = req.body["enable-build-in-chaos"] === 'true';
  if(req.body["username"] != undefined)
    Tiktok.TiktokUsername = req.body["username"];
  if(req.body["session"] != undefined)
    Tiktok.TiktokSessionId = req.body["session"];
  if(req.body["enable-vote"] != undefined)
    Tiktok.TiktokVoteEnable = req.body["enable-vote"] === 'true';
  if(req.body["vote-cooldown"] != undefined)
    Tiktok.TiktokVoteCooldown = parseInt(req.body["vote-cooldown"]);
  if(req.body["enable-force-effect"] != undefined)
    Tiktok.TiktokForceEffect = req.body["enable-force-effect"] === 'true';
  if(req.body["enable-indofinity"] != undefined)
    Tiktok.TiktokUseIndofinity = req.body["enable-indofinity"] === 'true';
  Config.Tiktok = Tiktok;
  fs.writeFileSync(__dirname + "/../../config.json", JSON.stringify(Config, null, 4), "utf8");
  res.json({status: "success"});
})

router.post('/handle-general-config', function(req, res, next) {
  let Config = JSON.parse(fs.readFileSync(__dirname + "/../../config.json", "utf8"));
  let General = Config.General;
  if(req.body["port"] != undefined)
    General.GUIWebsocketPort = parseInt(req.body["port"]);
  if(req.body["cooldown"] != undefined)
    General.Cooldown = parseInt(req.body["cooldown"]);
  if(req.body["duration"] != undefined)
    General.EffectDuration = parseInt(req.body["duration"]);
  if(req.body["seed"] != undefined)
    General.Seed = parseInt(req.body["seed"]);
  Config.General = General;
  fs.writeFileSync(__dirname + "/../../config.json", JSON.stringify(Config, null, 4), "utf8");
  res.json({status: "success"});
});

router.post('/handle-new-gift-config', function(req, res, next) {
  
})

router.post('/handle-spinwheel-config', function(req, res, next) {
  let Effects = JSON.parse(req.body["effects"]);
  fs.writeFileSync(__dirname + "/../../spinwheel-effects.json", JSON.stringify({effects: Effects}, null, 4), "utf8");
  res.json({status: "success"});
})

router.post('/handle-gift-config', function(req, res, next) {
  let Gifts = JSON.parse(fs.readFileSync(__dirname + "/../../gifts.json", "utf8"));
  let theGift = Gifts.find((item) => item.id == req.body["gift"]);
  if(theGift) {
    let effect_id = req.body["run-effect"];
    let effect = JSON.parse(fs.readFileSync(__dirname + "/../../effects.json", "utf8"))["Function"];
    let theEffect = effect.find((item) => item.id == effect_id);
    if(theEffect && effect_id != "disable") {
      if(theEffect.description == "" || theEffect.description == undefined) {
        return res.json({status: "error", message: "Description Problem!!"}).status(400);
      }
      theGift.run_effect = theEffect.description;
      fs.writeFileSync(__dirname + "/../../gifts.json", JSON.stringify(Gifts, null, 4), "utf8");
      return res.json({status: "success"});
    } else if (effect_id == "disable") {
      theGift.run_effect = "";
      fs.writeFileSync(__dirname + "/../../gifts.json", JSON.stringify(Gifts, null, 4), "utf8");
      return res.json({status: "success"});
    } else {
      return res.json({status: "error", message: "Effect not found"}).status(400);
    }
  }
})

module.exports = router;
