var buyAheadBase = 4300;

// Pre-req functions
function multiplyBy(x, y, n) {
    var tot = x * y;
    for (var i = 0; i < n; i++) {
        tot *= y;
    }
    return tot;
};

var buyAheadMaxTime = 0;
var clickedCookies = 0;
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
        Game.PopRandomWrinkler();
    }
}

var upgradePaused = false;
var $targetProduct;
var targetProductTimeNeeded = 1;
var $lastSelectedProduct;
function clickDahUpgrade() {
    if (upgradePaused) return;
    var upgrds = _$("#upgrades").getElementsByClassName("enabled");
    for (upgrd of upgrds) {
        upgrd.click();
        // _$("#promptOption0").click();
        console.log("Purchased upgrade.");
        return
    }
    var tupgrds = _$("#techUpgrades").getElementsByClassName("enabled");
    for (tupgrd of tupgrds) {
        tupgrd.click();
        console.log("Purchased research.");
        return
    }
    if (_$(".shimmer")) {
        if (!/wrath/.test(_$(".shimmer").style.background)) {
            _$(".shimmer").click();
            _$("#seasonPopup").click();
        }
        console.log("Clicked golden cookie.");
    }
    var lumpsAmount = Number.parseInt(_$("#lumpsAmount").innerHTML)
    if (lumpsAmount) {
        Game.clickLump();
        console.log("Obtained lump.");
    }

    Game.UpgradeSanta();
    Game.UpgradeDragon();
    var prods = _$("#products").getElementsByClassName("unlocked");
    var cookies = Game.cookies;
    var cookiesPs = Game.cookiesPs + mousClicksPerSecond;
    var $selectedProduct;
    var timeNeeded = 0;
    for ($prod of prods) {
        var prodName = $prod.getElementsByClassName("title")[0].innerHTML;
        if (prodName.includes("<span")) {
            prodName = prodName.split(">")[1].split("<")[0];
        }

        var price = Game.Objects[prodName].getPrice();
        var cookiesNeeded = price - cookies;
        timeNeeded = (cookiesNeeded / cookiesPs) * 1000;
        if (timeNeeded > 0 && timeNeeded < buyAheadMaxTime) { //It's going to take to long for cookies for the next thing, 
            // console.log("Target:" + timeNeeded + "Ms MouseCPS " + mousClicksPerSecond + "")
            targetProductTimeNeeded = timeNeeded;
            $targetProduct = $prod;
            $selectedProduct = null;
            break;
        } else {
            var activeProds = _$("#products").getElementsByClassName("enabled");
            if (activeProds && activeProds.length) { // buy it number of prods avail hits buyLength of buyable things.
                $selectedProduct = activeProds[activeProds.length - 1]; //get to greatest product.
            }
        }
    }

    if ($selectedProduct) {
        $targetProduct = null;
        $selectedProduct.click();
        $lastSelectedProduct = $selectedProduct;
        var selectedProductName = $selectedProduct.getElementsByClassName("title")[0].innerHTML;
        if (selectedProductName.includes("<span")) {
            selectedProductName = selectedProductName.split(">")[1].split("<")[0];
        }
        console.log("Buying '" + selectedProductName + "'.");
    }

    for ($prod of prods) {
        $prod.style = "border: none;";
    }

    if ($lastSelectedProduct) {
        $lastSelectedProduct.style = "border: 4px solid lime; margin: - 4px;";
    }
    if ($targetProduct) {
        $targetProduct.style = "border: 5px solid aqua; margin: - 5px;";
    }

}
function updateBuyRate() {
    var prods = _$("#products").getElementsByClassName("unlocked");
    var prodName = prods[prods.length - 1].getElementsByClassName("title")[0].innerHTML;
    if (prodName == "Prism") {
        buyAheadMaxTime = multiplyBy(buyAheadBase, 1.9, 10);
    } else if (prodName == "Antimatter condenser") {
        buyAheadMaxTime = multiplyBy(buyAheadBase, 2, 9);
    } else if (prodName == "Time machine") {
        buyAheadMaxTime = multiplyBy(buyAheadBase, 2, 8);
    } else if (prodName == "Portal") {
        buyAheadMaxTime = multiplyBy(buyAheadBase, 2, 7);
    } else if (prodName == "Alchemy lab") {
        buyAheadMaxTime = multiplyBy(buyAheadBase, 2, 6);
    } else if (prodName == "Shipment") {
        buyAheadMaxTime = multiplyBy(buyAheadBase, 2, 5);
    } else if (prodName == "Wizard tower") {
        buyAheadMaxTime = multiplyBy(buyAheadBase, 2, 4);
    } else if (prodName == "Factory") {
        buyAheadMaxTime = multiplyBy(buyAheadBase, 2, 3);
    } else if (prodName == "Mine") {
        buyAheadMaxTime = multiplyBy(buyAheadBase, 2, 2);
    } else if (prodName == "Farm") {
        buyAheadMaxTime = multiplyBy(buyAheadBase, 2, 1);
    } else if (prodName == "Grandma") {
        buyAheadMaxTime = buyAheadBase;
    }
}

var clickCookieInterval;
var clickUpgradesInterval;
function start() { clickCookieInterval = setInterval(clickDahCookie, 1); clickUpgradesInterval = setInterval(clickDahUpgrade, 20); return true; }
function stop() { clearInterval(clickCookieInterval); clearInterval(clickUpgradesInterval); return true; }
stop();
start();

//utils

function spawnShimmer(ammount = 1) {
    while (ammount > 0) {
        var newShimmer = new Game.shimmer("golden");
        newShimmer.spawnLead = 1;
        ammount--;
    }
}
function boost() { // debugging tool
    spawnShimmer(2);
}
function pauseUpgrades() {
    if (upgradePaused) {
        upgradePaused = false;
    } else {
        upgradePaused = true;
    }
    return upgradePaused;
}


