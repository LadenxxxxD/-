let BoxEnterAnimation = function (args) {
    // 使用立即执行函数初始化
    data = (function () {
        const box = document.querySelector(args.el);
        let status = "in";

        // 创建一个dom节点
        let uniqueFlag = "scope" + Math.floor(Math.random() * 9000 + 1000);
        console.log(uniqueFlag);
        let relative = document.createElement("div");
        relative.setAttribute("data-scope", uniqueFlag);
        relative.style.position = "relative";
        relative.style.overflow = "hidden";
        relative.style.height = "100%";
        relative.style.borderRadius = "inherit";
        box.appendChild(relative);
        let circular = document.createElement("div");
        circular.setAttribute("class", "circular");
        circular.setAttribute("data-scope", uniqueFlag);
        relative.appendChild(circular);

        // 将css写入head
        setHeadStyle(uniqueFlag);

        // 勾股定理计算圆形直径
        let height = box.clientHeight;
        let width = box.clientWidth;
        let hypotenuse = Math.ceil(Math.sqrt(Math.pow(height, 2) + Math.pow(width, 2)));

        // 将传入的配置对象覆盖到css变量
        let cssVar = document.documentElement.style;
        cssVar.setProperty("--circular-diameter", 2 * hypotenuse + "px");
        if (args.config.color) {
            cssVar.setProperty("--circular-color", args.config.color);
        }
        if (args.config.animationDuration) {
            cssVar.setProperty("--animation-duration", args.config.animationDuration / 1000 + "s");
        }
        // 返回结果对象
        return {
            container: box,
            status: status,
            circular: box.querySelector(".circular")
        }
    })();

    // 
    function setHeadStyle(scope) {
        var style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = `
.circular[data-scope=${scope}] {
    position: absolute;
    top: 0;
    left: 0;
    width: 0px;
    height: 0px;
    border-radius: 50%;
    background-color: var(--circular-color);
    transform: translate(-50%, -50%);
}

.circular[data-scope=${scope}].in {
    width: 0;
    height: 0;
    animation: in ease-out forwards;
    animation-duration: var(--animation-duration);
}

.circular[data-scope=${scope}].out {
    width: var(--circular-diameter);
    height: var(--circular-diameter);
    animation: out ease-out forwards;
    animation-duration: var(--animation-duration);

}

@keyframes in {
    0% {
        width: 0;
        height: 10;
    }

    100% {
        width: var(--circular-diameter);
        height: var(--circular-diameter);
    }
}

@keyframes out {
    0% {
        width: var(--circular-diameter);
        height: var(--circular-diameter);
    }

    100% {
        width: 0;
        height: 0;
    }
}
                `
        document.getElementsByTagName("head").item(0).appendChild(style);
    }

    function changeStatus(node, currentStatus, x, y) {
        if (currentStatus == "in") {
            node.classList.remove("out");
            node.classList.add("in");
            data.status = "out";
        }
        else {
            node.classList.remove("in");
            node.classList.add("out");
            data.status = "in";
        }
        node.style.left = x + "px";
        node.style.top = y + "px";

    }

    // 添加鼠标监听事件
    data.container.addEventListener("mouseenter", e => {
        if (data.status == "in") {
            let x = e.clientX - e.target.offsetLeft;
            let y = e.clientY - e.target.offsetTop;
            changeStatus(data.circular, data.status, x, y);
        }
    });

    data.container.addEventListener("mouseleave", e => {
        if (data.status == "out") {
            let x = e.clientX - e.target.offsetLeft;
            let y = e.clientY - e.target.offsetTop;
            changeStatus(data.circular, data.status, x, y);

        }
    });
}