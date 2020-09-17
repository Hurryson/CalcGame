
const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    //游戏是否开始
    isPlaying: boolean = false;

    //当前关卡计时器
    leveltimer: number = 0;

    //每题答题时间
    perAnswerTimeLimit: number = 2;

    //当前题目计时器
    answerTimer: number = 0;

    //UI
    @property(cc.Button)
    startBtn: cc.Button = null

    @property(cc.Label)
    timerLabel: cc.Label = null;
    //组件
    answerBase;

    answerUI;

    start() {
        this.answerBase = cc.find('Canvas/Scripts').getComponent('AnswerBase');
        this.answerUI = cc.find('Canvas/Answer').getComponent('AnswerUI');
    }

    update(dt) {
        if (this.isPlaying == true) {
            this.leveltimer += dt;
            this.timerLabel.string = "总用时：" + this.leveltimer.toFixed(1);
            this.answerTimer += dt;
            if (this.answerTimer > this.perAnswerTimeLimit) {
                this.answerBase.nextAnswer();
                this.answerUI.updateResultLabel("超时", cc.Color.RED);
                this.answerTimer = 0;
            }
        }
    }

    //重置当前答题时间
    resetCurrAnswerTimer() {
        this.answerTimer = 0;
    }

    //游戏开始
    startGame() {
        this.resetCurrAnswerTimer();
        this.startBtn.node.active = false;
        this.leveltimer = 0;
        this.isPlaying = true;
        this.answerUI.updateResultLabel("", cc.Color.RED);
    }

    //游戏结束
    stopGame() {
        this.isPlaying = false;
        this.answerBase.spawnResultReport();
        this.startBtn.node.active = true;
    }

    clearUI() {
        this.leveltimer = 0.0;
        this.timerLabel.string = "总用时：" + this.leveltimer.toFixed(1);
        this.answerUI.updateResultLabel("", cc.Color.RED);
    }
}
