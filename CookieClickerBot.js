var buyAheadBase = 120000; //2 Minutes max time, probably gets better to wait longer though, as long as there are buyout rules for ex
// Pre-req functions
function multiplyBy(x, y, n) {
    var tot = x * y;
    for (var i = 0; i < n; i++) {
        tot *= y;
    }
    return tot;
};

var _$ = $;
var buyAheadMaxTime = 5000;
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
function clickDahUpgrade() {
    if (upgradePaused) return;
    if (buyUpgrades()) return;
    if (buyResearch()) return;
    clickaShimmer();

    var lumpsAmount = Number.parseInt(_$("#lumpsAmount").innerHTML)
    if (lumpsAmount) {
        _$("#lumps").click()
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
        timeNeeded = Math.floor(((cookiesNeeded / cookiesPs) * 1000));

        if (!buyAllMode && timeNeeded > 0 && timeNeeded < buyAheadMaxTime) { //It's going to take to long for cookies for the next thing, 
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
var lastBestProd;
function updateBuyRate() {
    var prods = _$("#products").getElementsByClassName("unlocked");
    var prodName = prods[prods.length - 1].getElementsByClassName("title")[0].innerHTML;
    if (prodName.includes("<span")) {
        prodName = prodName.split(">")[1].split("<")[0];
    }
    if (["Alchemy lab", "Portal", "Time machine", "Chancemaker", "Prism", "Chancemaker", "Fractal engine", "Javascript console"].includes(prodName)) {
        buyAheadMaxTime = buyAheadBase;
    } else if (["Wizard tower", "Shipment"].includes(prodName)) {
        buyAheadMaxTime = buyAheadBase / 1
    } else if (prodName == "Temple") {
        buyAheadMaxTime = buyAheadBase / 2
    } else if (prodName == "Bank") {
        buyAheadMaxTime = buyAheadBase / 3
    } else if (prodName == "Factory") {
        buyAheadMaxTime = buyAheadBase / 4
    } else if (prodName == "Mine") {
        buyAheadMaxTime = buyAheadBase / 5
    } else if (prodName == "Farm") {
        buyAheadMaxTime = buyAheadBase / 6
    } else if (prodName == "Grandma") {
        buyAheadMaxTime = buyAheadBase / 7;
    }
    if (lastBestProd != prodName) {
        console.log("Unlocked product '" + prodName + "'. Max wait time '" + (buyAheadMaxTime / 1000) + " Ms'")
        lastBestProd = prodName;
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
function buyAll() {
    if (buyAllMode) {
        buyAllMode = false;
    } else {
        buyAllMode = true;
    }
    return buyAllMode;
}

