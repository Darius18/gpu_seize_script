// 创建GUI容器
let guiContainer = document.createElement("div");
guiContainer.style.position = "fixed";
guiContainer.style.top = "10px";
guiContainer.style.right = "10px";
guiContainer.style.backgroundColor = "white";
guiContainer.style.border = "1px solid black";
guiContainer.style.borderRadius = "5px";
guiContainer.style.padding = "10px";
guiContainer.style.zIndex = "9999";
document.body.appendChild(guiContainer);

// 添加标题
let title = document.createElement("h2");
title.textContent = "服务器抢占进程";
guiContainer.appendChild(title);

// 添加按钮
let button1 = document.createElement("button");
button1.classList = "button-6";
button1.textContent = "点击开始";
guiContainer.appendChild(button1);

//添加反馈信息：
let feedback = document.createElement("div");
feedback.classList = "feedback";
feedback.textContent = "";
guiContainer.appendChild(feedback);

let button2 = document.createElement("button");
button1.classList = "button-6";
button2.textContent = "结束";
guiContainer.appendChild(button2);

// 添加事件监听器
button1.addEventListener("click", function () {
  let log = document.createElement("p");
  log.textContent = "✅新增一条信息！";
  feedback.appendChild(log);
  feedback.scrollTop = feedback.scrollHeight;
});

function scrollDown() {}

// 添加样式
let style = document.createElement("style");
style.textContent = `
        #myGuiContainer {
        box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
        }
        #myGuiContainer input {
            margin-bottom: 10px;
        }
        #myGuiContainer button {
            display: block;
            margin-bottom: 10px;
            margin:0 auto;
        }
        #myGuiContainer .feedback {
            margin:10px;
            borderRadius:5px;
            font-size:0.6rem;
        overflow:scroll;
        max-height: 300px;
        }

        .button-6 {
  align-items: center;
  background-color: #FFFFFF;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: .25rem;
  box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
  box-sizing: border-box;
  color: rgba(0, 0, 0, 0.85);
  cursor: pointer;
  display: inline-flex;
  font-family: system-ui,-apple-system,system-ui,"Helvetica Neue",Helvetica,Arial,sans-serif;
  font-size: 16px;
  font-weight: 600;
  justify-content: center;
  line-height: 1.25;
  margin: 0;
  min-height: 3rem;
  padding: calc(.875rem - 1px) calc(1.5rem - 1px);
  position: relative;
  text-decoration: none;
  transition: all 250ms;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: baseline;
  width: auto;
  margin-bottom: 10px;
}

.button-6:hover,
.button-6:focus {
  border-color: rgba(0, 0, 0, 0.15);
  box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
  color: rgba(0, 0, 0, 0.65);
}

.button-6:hover {
  transform: translateY(-1px);
}

.button-6:active {
  background-color: #F0F0F1;
  border-color: rgba(0, 0, 0, 0.15);
  box-shadow: rgba(0, 0, 0, 0.06) 0 2px 4px;
  color: rgba(0, 0, 0, 0.65);
  transform: translateY(0);
}
    `;
document.head.appendChild(style);

// 给GUI容器添加ID，方便样式控制
guiContainer.id = "myGuiContainer";
