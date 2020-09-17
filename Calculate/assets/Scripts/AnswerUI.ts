
const {ccclass, property} = cc._decorator;

@ccclass
export default class AnswerUI extends cc.Component {

    @property(cc.Label)
    title: cc.Label = null;

    @property(cc.Label)
    nextAnswerTitle: cc.Label = null;

    @property(cc.Label)
    nextAnswerLabel: cc.Label = null;

    @property(cc.Label)
    currAnswerTitle: cc.Label = null;

    @property(cc.Label)
    currAnswerLabel: cc.Label = null;

    @property(cc.Label)
    resultLabel : cc.Label = null;

    updateCurrCalcUI(id, symbol, num1,num2,res)
    {
        this.currAnswerTitle.string = "第" + id + "题";
        this.currAnswerLabel.string = num1 + " " + symbol + " " + num2 + " = ?";
    }

    updateNextCalcUI(id,symbol,num1,num2,res)
    {
        this.nextAnswerTitle.string = "第" + id + "题";
        this.nextAnswerLabel.string = num1 + " " + symbol + " " + num2 + " = ?";
    }

    updateResultLabel(res,color)
    {
        this.resultLabel.string = res;
        this.resultLabel.node.color = color;
    }
}
