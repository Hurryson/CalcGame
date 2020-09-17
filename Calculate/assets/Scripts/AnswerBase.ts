
const { ccclass, property } = cc._decorator;

class AnswerData {
    id;         //ID
    symbol;     //符号1
    num1;       //值1
    num2;       //值2
    result;     //正确答案
    compare;    //对比答案 0对 1错

    constructor(_symbol, _num1, _num2, _result) {
        this.symbol = _symbol;
        this.num1 = _num1;
        this.num2 = _num2;
        this.result = _result;
    }
}

@ccclass
export default class AnswerBase extends cc.Component {

    //临时存储问题数据
    answerDataTemp: AnswerData;
    //存储所有题的数组
    answerDatas: AnswerData[];
    //存储答案的数组

    //最大题目数
    answerMax: number = 5;
    //回溯
    answerInterval: number = 1;
    //当前题ID
    currAnswerID: number = 0;
    //当前题的答案
    currAnswer: number = 0;


    //AnswerUI Script
    answerUI;
    //Main Script
    main;

    //-------结果报告页面---------
    @property(cc.Node)
    reportPanel : cc.Node = null;
    //单个题结果的预制体
    @property(cc.Prefab)
    result: cc.Prefab = null;
    //预制体父物体
    @property(cc.Node)
    reportBack: cc.Node = null;
    //总用时统计Label
    @property(cc.Label)
    totalTimerReportLabel : cc.Label = null;

    start() {
        //脚本赋值
        this.main = cc.find('Canvas/Scripts').getComponent('Main');
        this.answerUI = cc.find('Canvas/Answer').getComponent('AnswerUI');
    }

    initAnswer(max) {
        this.answerMax = max;
        this.currAnswerID = 0;
        this.answerDatas = new Array();
        //初始化 随机20道题
        for (var i = 0; i < this.answerMax; i++) {
            //随机max次
            this.randomAnswer();
            this.answerDatas[i] = this.answerDataTemp;
        }

        this.updateCurrAnswer();
        this.updateNextAnswer();
    }

    resetGame() {
        this.initAnswer(10);
        this.main.startGame();
    }

    //随机一个int 包括lower和upper
    randomNum(lower, upper) {
        return Math.floor(Math.random() * (upper - lower + 1)) + lower;
    }

    //随机一道加法题
    randomAddAnswer() {
        //随机一个答案
        var answer = this.randomNum(0, 9);
        //随机加数1
        var num1 = this.randomNum(0, answer);
        //计算加数2
        var num2 = answer - num1;
        //临时赋值
        this.answerDataTemp = new AnswerData("+", num1, num2, answer);
    }

    //随机一道减法题
    randomSubAnswer() {
        var answer = this.randomNum(0, 9);
        var num1 = this.randomNum(answer, 9);
        var num2 = num1 - answer;
        //临时赋值
        this.answerDataTemp = new AnswerData("-", num1, num2, answer);
    }

    //随机一个加法或者减法
    randomAnswer() {
        var type = this.randomNum(0, 1);
        if (type == 0)
            this.randomAddAnswer();
        else
            this.randomSubAnswer();
    }

    //获取当前问题的标准答案
    getCurrAnswerResult() {
        if (this.currAnswerID < this.answerDatas.length)
            return this.answerDatas[this.currAnswerID].result;
    }

    //更新当前题的UI显示
    updateCurrAnswer() {
        if (this.currAnswerID < this.answerMax) {
            //第一题赋值
            var data = this.answerDatas[this.currAnswerID];
            this.answerUI.updateCurrCalcUI(this.currAnswerID + 1, data.symbol, data.num1, data.num2, data.result);
        }
    }

    //更新下一题的UI显示
    updateNextAnswer() {
        if (this.currAnswerID < this.answerMax - this.answerInterval) {
            //第二题赋值
            var data = this.answerDatas[this.currAnswerID + this.answerInterval];
            this.answerUI.updateNextCalcUI(this.currAnswerID + + this.answerInterval + 1, data.symbol, data.num1, data.num2, data.result);
        }
    }

    //更新结果
    updateCompare(compare){
        this.answerDatas[this.currAnswerID].compare = compare;
    }

    //跳转到下一题
    nextAnswer() {
        if (this.currAnswerID < this.answerMax) {
            this.main.resetCurrAnswerTimer();
            this.currAnswerID += 1;
            this.updateCurrAnswer();
            this.updateNextAnswer();
        }
        console.log("count " + this.currAnswerID)
        if (this.currAnswerID == this.answerMax) {
            this.main.stopGame();
        }
    }

    //生成结果报告
    spawnResultReport() {
        this.reportPanel.active = true;
        for (var i = 0; i < this.answerMax; i++) {
            var res = cc.instantiate(this.result);
            res.parent = this.reportBack;
            var resBack = res.getChildByName('Back');
            var resLabel = res.getChildByName('Label').getComponent(cc.Label);
            //题号赋值
            resLabel.string = i.toString();
            var rightCount = 0;
            var wrongCount = 0;
            //背景色赋值
            if(this.answerDatas[i].compare == 0)
            {
                resBack.color = cc.Color.GREEN;
            }
            else
            {
                resBack.color = cc.Color.RED;
            }
            
            this.totalTimerReportLabel.string = "总用时：" + this.main.leveltimer.toFixed(1) + " 秒！";
        }
    }

    closeResultReport()
    {
        this.reportPanel.active = false;
        this.main.clearUI();
    }
}
