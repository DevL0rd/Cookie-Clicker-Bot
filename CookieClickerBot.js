var buyAheadBase = 120000; //2 Minutes max time, probably gets better to wait longer though, as long as there are buyout rules for ex
var buyAheadMaxTime = 30000;
// Pre-req functions
function multiplyBy(x, y, n) {
    var tot = x * y;
    for (var i = 0; i < n; i++) {
        tot *= y;
    }
    return tot;
};

var _$ = $;
var mousClicksPerSecond = 0;
var cpsTracker = 0;
var cpsEnd = (new Date()).getTime() + 1000;
function clickDahCookie() {
    _$("#bigCookie").click();
    cpsTracker += Game.computedMouseCps;
    var now = (new Date()).getTime()
    if (now >= cpsEnd) {
        cpsEnd = now + 1000;
        mousClicksPerSecond = cpsTracker;
        cpsTracker = 0;
        updateBuyRate();
    }
}

var upgradePaused = false;
var buyAllMode = false;

function buyUpgrades() {
    var upgrds = _$("#upgrades").getElementsByClassName("enabled");
    for (upgrd of upgrds) {
        upgrd.click();
        // _$("#promptOption0").click(); // check if there first
        console.log("Purchased upgrade.");
        return true;
    }
}
function buyResearch() {
    var tupgrds = _$("#techUpgrades").getElementsByClassName("enabled");
    for (tupgrd of tupgrds) {
        tupgrd.click();
        console.log("Purchased research.");
        return true;
    }
}
function clickaShimmer() {
    if (_$(".shimmer")) {
        // if (!_$(".shimmer").style.backgroundImage.includes("wrath") && !_$(".shimmer").style.backgroundImage.includes("clot")) {
        _$(".shimmer").click();
        _$("#seasonPopup").click();
        // }
        console.log("Clicked shimmer.");
    }
}

function getTimeToBuyable(prod) {
    var prodName = getProductName(prod);
    var cookies = Game.cookies;
    var price = Game.Objects[prodName].getPrice();
    var cookiesNeeded = price - cookies;
    var cookiesPs = Game.cookiesPs + mousClicksPerSecond;
    return Math.floor(((cookiesNeeded / cookiesPs) * 1000));
}
function getWorstProduct() {
    var prods = _$("#products").getElementsByClassName("unlocked");
    $prod = prods[0]; //get to greatest product.
    $prod.timeNeeded = 0;
    return $prod;
    return false
}
function getBestActiveProduct() {
    var enabledProds = _$("#products").getElementsByClassName("enabled");
    if (enabledProds && enabledProds.length) { // buy it number of prods avail hits buyLength of buyable things.
        $prod = enabledProds[enabledProds.length - 1]; //get to greatest product.
        if ($prod) $prod.timeNeeded = 0;
        return $prod;
    }
    return false
}
function getProductInWaitRange() {
    var prods = _$("#products").getElementsByClassName("unlocked");
    for (var i = prods.length - 1; i > -1; i--) {
        var $prod = prods[i];
        var timeNeeded = getTimeToBuyable($prod);
        if (timeNeeded < buyAheadMaxTime) {
            $prod.timeNeeded = timeNeeded;
            return $prod;
        }
    }
    return false;
}
function resetProdBorders() {
    var prods = _$("#products").getElementsByClassName("unlocked");
    for ($prod of prods) {
        $prod.style = "border: none;";
    }
}
function getCanBuyAmmount(prod) {
    var prodName = getProductName(prod);
    var cookies = Game.cookies;
    var price = Game.Objects[prodName].getPrice();
    return Math.floor(cookies / price);
}
var lastTargetName = "";
var $lastClickedProduct;
function clickDahUpgrade() {
    if (upgradePaused) return;
    if (buyUpgrades()) return;
    if (buyResearch()) return;
    clickaShimmer();
    Game.UpgradeSanta();
    Game.UpgradeDragon();


    var $worstProd = getWorstProduct();
    var $prod;
    if (buyAllMode) {
        $prod = getBestActiveProduct();
        if (!$prod) {
            buyAllMode = false;
            console.log("Resuming normal bot function.");
        }
    } else {
        var canBuy = getCanBuyAmmount($worstProd);
        if (canBuy > 200) {
            buyAllMode = true;
            console.log("Buying up all products to even growth.");
        }
        $prod = getProductInWaitRange();

    }


    if ($prod) {
        var prodName = getProductName($prod);
        if ($prod.timeNeeded <= 0) {
            $prod.click();
            $lastClickedProduct = $prod;
            lastTargetName = "";
            console.log("Buying '" + prodName + "'.");
        } else {
            if (lastTargetName != prodName) {
                lastTargetName = prodName;
                console.log("Waiting for '" + prodName + "' in '" + Math.round($prod.timeNeeded / 1000) + " S'.");
            }
        }
    }

    resetProdBorders();
    if ($lastClickedProduct) {
        $lastClickedProduct.style = "border: 4px solid lime; margin: - 4px;";
    }
    if ($prod) {
        $prod.style = "border: 5px solid aqua; margin: - 5px;";
    }

}
var lastBestProd;
function updateBuyRate() {
    var prods = _$("#products").getElementsByClassName("unlocked");
    var prod = prods[prods.length - 1];
    if (lastBestProd != prod) {
        var prodName = getProductName(prod);
        console.log("Unlocked product '" + prodName + "'. Max wait time '" + (buyAheadMaxTime / 1000) + " S'");
        lastBestProd = prod;
        buyAheadMaxTime = getProductWaitForNextTime(prod);
    }
}
function getProductName(prod) {
    var prodName = prod.getElementsByClassName("title")[0].innerHTML;
    if (prodName.includes("<span")) {
        prodName = prodName.split(">")[1].split("<")[0];
    }
    return prodName;
}
function getProductWaitForNextTime(prod) {
    var prodName = getProductName(prod);
    if (["Alchemy lab", "Portal", "Time machine", "Chancemaker", "Prism", "Chancemaker", "Fractal engine", "Javascript console"].includes(prodName)) {
        return buyAheadBase;
    } else if (["Wizard tower", "Shipment"].includes(prodName)) {
        return buyAheadBase / 1
    } else if (prodName == "Temple") {
        return buyAheadBase / 2
    } else if (prodName == "Bank") {
        return buyAheadBase / 3
    } else if (prodName == "Factory") {
        return buyAheadBase / 4
    } else if (prodName == "Mine") {
        return buyAheadBase / 5
    } else if (prodName == "Farm") {
        return buyAheadBase / 6
    } else if (prodName == "Grandma") {
        return buyAheadBase / 7;
    }
}
// function playGardenGame() {
//     gardenTile
// }
function popWrinkler(ammount = 1) {
    while (ammount > 0) {
        Game.PopRandomWrinkler()
        ammount--;
    }
}
function popDahWrinklers() {
    popWrinkler(3)
}
var popWrinklerInterval;
var clickCookieInterval;
var clickUpgradesInterval;
function start() { clickCookieInterval = setInterval(clickDahCookie, 1); clickUpgradesInterval = setInterval(clickDahUpgrade, 10); popWrinklerInterval = setInterval(popDahWrinklers, 60000); return true; }
function stop() { clearInterval(clickCookieInterval); clearInterval(clickUpgradesInterval); clearInterval(popWrinklerInterval); return true; }
stop();
start();

//utils

function boost(ammount = 1) {
    while (ammount > 0) {
        var newShimmer = new Game.shimmer("golden");
        newShimmer.spawnLead = 1;
        ammount--;
    }
}
function pauseUpgrades() {
    if (upgradePaused) {
        upgradePaused = false;
    } else {
        upgradePaused = true;
    }
    return upgradePaused;
}
function buyAll() {
    if (buyAllMode) {
        buyAllMode = false;
    } else {
        buyAllMode = true;
    }
    return buyAllMode;
}
