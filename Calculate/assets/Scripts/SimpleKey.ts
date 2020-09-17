
const { ccclass, property } = cc._decorator;

@ccclass
export default class SimpleKey extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    answerBase;

    answerUI;

    main;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.label = this.getComponentInChildren(cc.Label);
        this.answerBase = cc.find('Canvas/Scripts').getComponent('AnswerBase');
        this.answerUI = cc.find('Canvas/Answer').getComponent('AnswerUI');
        this.main = cc.find('Canvas/Scripts').getComponent('Main');
        //按钮事件监听
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node; //这个 node 节点是你的事件处理代码组件所属的节点，这里就是Button2
        clickEventHandler.component = "SimpleKey";//这个是脚本文件名
        clickEventHandler.handler = "OnClickBtn"; //回调函名称
        clickEventHandler.customEventData = this.label.string; //用户数据

        var button = this.node.getComponent(cc.Button); //获取cc.Button组件
        button.clickEvents.push(clickEventHandler); //增加处理
    }

    update(dt) {

    }

    public OnClickBtn(event, customEventData) {
        console.log(customEventData)
        var result = this.answerBase.getCurrAnswerResult();
        var key = customEventData;
        if (key == "重置") {
            this.answerBase.resetGame();
            this.answerBase.initAnswer(5);
        }
        else if (key == "跳过") {
            console.log("跳过")
        }
        else {
            if (this.main.isPlaying == true) {
                if (result == key) {
                    console.log("right");
                    this.answerUI.updateResultLabel("正确", cc.Color.GREEN);
                    this.answerBase.updateCompare(0);
                    //回答正确 自动进入到下一题
                    this.answerBase.nextAnswer();
                }
                else {
                    console.log("wrong");
                    this.answerBase.updateCompare(1);
                    //错误提示
                    this.answerUI.updateResultLabel("错误", cc.Color.RED);
                }
            }
        }
    }
}
