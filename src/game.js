/**
 * 每个大小 25
 * 间距 5
 * 初级：10个   大小: 9*9
 * 中级：40个   大小: 16*16
 * 高级：99个   大小: 30*16
 * id用来表示坐标
 * class用来表示周边8格雷的数量
 */
const easyLandmine = 10;
const easySquare = 9 * 9;
const normalLandmine = 40;
const normalSquare = 16 * 16;
const hardLandmine = 99;
const hardSquare = 30 * 16;

let landmineCount;

let timer = setInterval(()=>{ }, 100);

// 游戏场景初始化
let scenesCreate = function (level) {
    let scenes = document.querySelector(".level");
    let scenes_ul = document.querySelector(".level ul");
    // 设置每个方格的长度
    let squareLong = 25;
    // 设置每个方格的间距
    let space = 5;
    // 清空当前游戏场景内容
    scenes_ul.innerHTML = "";
    // 在场景中禁止右键菜单
    scenes.oncontextmenu = function () {
        return false;
    }
    // 添加场景
    for (let i = 0; i < scenes.offsetHeight; i += (squareLong + space)) {
        for (let j = 0; j < scenes.offsetWidth; j += (squareLong + space)) {
            let li = document.createElement('li');
            li.id = i / (squareLong + space) + "_" + j / (squareLong + space);
            li.style.width = squareLong + "px";
            li.style.height = squareLong + "px";
            li.style.cssFloat = "left";
            li.style.marginRight = space + "px";
            li.style.marginBottom = space + "px";
            li.style.background = "#66ccff";
            scenes_ul.appendChild(li)
        }
    }
}

// 创建雷
let landmineCreate = function (level) {
    let temp = [];
    let li = document.querySelectorAll(".level ul li");
    // 根据难度生成地雷
    if (level == "easy") {
        landmineCount = easyLandmine
        for (let i = 0; i < easySquare; i++) {
            if (i < easyLandmine) {
                temp.push("*");
            } else {
                temp.push("0");
            }
        }
    }
    if (level == "normal") {
        landmineCount = normalLandmine
        for (let i = 0; i < normalSquare; i++) {
            if (i < normalLandmine) {
                temp.push("*");
            } else {
                temp.push("0")
            }
        }
    }
    if (level == "hard") {
        landmineCount = hardLandmine;
        for (let i = 0; i < hardSquare; i++) {
            if (i < hardLandmine) {
                temp.push("*");
            } else {
                temp.push("0")
            }
        }
    }
    // 打乱地雷顺序
    while (temp.length != 0) {
        let random = parseInt(Math.random() * temp.length);
        li[temp.length - 1].className = temp[random];
        temp.splice(random, 1);
    }
}

// 创建旗帜
let flagCreate = function () {
    let li = document.querySelectorAll(".level ul *");
    for (let i = 0; i < li.length; i++) {
        let img = document.createElement('img');
        img.src = "img/flag.png";
        img.className = "flag";
        img.style.display = "none";
        li[i].appendChild(img)
    }
}

// 检查周边雷的数量
let Minesweeper = function () {
    let li = document.querySelectorAll(".level ul li");
    for (let i = 0; i < li.length; i++) {
        if (li[i].className == "*") {
            // 获取雷的坐标位置, 并给周边8格的 class 加一
            let position = li[i].id.split('_');
            let around = new Around(parseInt(position[0]), parseInt(position[1]));
            for (let j = 0; j < around.length; j++) {
                let temp = document.getElementById(around[j].x + "_" + around[j].y);
                try {
                    if (temp.className != "*") {
                        temp.className = parseInt(temp.className) + 1;
                        li[i].querySelector("img").className = "landmine";
                    }
                } catch (e) {
                }
            }
        }
    }
}

// 鼠标点击事件
let mouseButtonEvent = function (level) {
    let li = document.querySelectorAll(".level ul li")
    for (let i = 0; i < li.length; i++) {
        let img = li[i].querySelector("img");
        li[i].oncontextmenu = function () {
            // 判断旗帜是否已经显示
            if (img.style.display == "none") {
                // 判断者方块已被点击或雷是否已经显示
                if (li[i].innerHTML != "") {
                    // 显示旗帜
                    img.style.display = "block";
                    landmineCount--;
                }
            } else {
                // 隐藏旗帜
                img.style.display = "none";
                landmineCount++
            }
        }
        li[i].onclick = function () {
            // 判断旗帜是否显示
            if (img.style.display == "none") {
                li[i].style.background = "#aaaaaa";
                // 判断此位置是否有雷
                if (li[i].className != "*") {
                    // 存储需要搜索的方格
                    let searchList = [];
                    // 添加搜索列表初始的内容
                    li[i].className == "0" ? searchList.push(li[i]) : li[i].innerHTML = li[i].className;
                    // 搜索所有需要打开的格子
                    while (searchList.length >= 0) {
                        let position = searchList[0].id.split('_')
                        let around = new Around(parseInt(position[0]), parseInt(position[1]));
                        for (let j = 0; j < around.length; j++) {
                            let temp = document.getElementById(around[j].x + "_" + around[j].y);
                            if (temp != null) {
                                // 检查方格是否被打开
                                // console.log(temp.style.background)
                                if (temp.style.background != "rgb(170, 170, 170)") {
                                    temp.style.background = "#aaaaaa";
                                    // 检查是否为空方格, 如果是空方格就添加到数组中下一轮继续搜索, 否则就显示内容
                                    temp.className == "0" ? searchList.push(temp) : temp.innerHTML = temp.className;
                                }
                            }
                        }
                        searchList.splice(0, 1);
                    }
                }
                // 游戏失败后的操作
                else {
                    let landmines = document.querySelectorAll(".landmine");
                    for (let j = 0; j < landmines.length; j++) {
                        landmines[j].src = "img/landmine.png";
                        landmines[j].style.background = "red";
                        landmines[j].style.display = "block";
                    }
                    console.log("game over")
                    clearInterval(timer);
                    setTimeout(()=>{
                        if(confirm('你踩雷了, 是否重新开始游戏')) {
                            Start(level)
                        }
                    }, 30);
                }
            }
        }
    }
}

// 难度选择
let levelSelect = function (level) {
    let scenes = document.querySelector(".level");
    scenes.id = level;
}

// 获取周围方块的坐标
let Around = function (x, y) {
    let temp = [
        {x: x - 1, y: y + 1},
        {x: x, y: y + 1},
        {x: x + 1, y: y + 1},
        {x: x - 1, y: y},
        {x: x + 1, y: y},
        {x: x - 1, y: y - 1},
        {x: x, y: y - 1},
        {x: x + 1, y: y - 1},
    ]
    return temp;
}

// 开始游戏
let Start = function (level) {
    // 开始游戏
    levelSelect(level);
    scenesCreate(level);
    landmineCreate(level);
    flagCreate();
    Minesweeper();
    mouseButtonEvent(level);
    // 获取不是地雷的方格
    let flags = document.querySelectorAll(".flag");
    let blocks = [];
    for (let i = 0; i < flags.length; i++) {
        blocks.push(flags[i].parentElement);
    }
    // 关闭定时器
    clearInterval(timer);
    // 开始时间
    let startTime = new Date().getTime();
    timer = setInterval(()=>{
        // 剩余雷数
        document.querySelector("#landmine").innerHTML = landmineCount;
        // 计时器
        document.querySelector("#time").innerHTML = parseInt(((new Date().getTime()) - startTime) / 1000);
        // 判断是否胜利
        for (let i = 0; i < blocks.length; i++) {
            if (blocks[i].style.background == "rgb(170, 170, 170)") {
                blocks.splice(i, 1);
                if (blocks.length == 0) {
                    console.log("win");
                    clearInterval(timer);
                    setTimeout(()=>{
                        alert("你赢啦, 你一共花费了" + document.querySelector("#time").innerHTML + "秒");
                        if(confirm('是否需要重新开始游戏')) {
                            Start(level)
                        }
                    }, 30);
                }
            }
        }
    }, 30)
}

Start("easy");