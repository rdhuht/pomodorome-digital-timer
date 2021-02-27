function seconds2HHMMSS (数字: number) {
    tm.showbit(Math.idiv(Math.idiv(数字, 60), 10), 0)
    tm.showbit(Math.idiv(数字, 60) % 10, 1)
    tm.showbit(Math.idiv(数字 % 60, 10), 2)
    tm.showbit(数字 % 60 % 10, 3)
}
// 工作/休息 切换
// 切换时
input.onButtonPressed(Button.AB, function () {
    if (ready) {
        button_a_click_times += 1
        if (button_a_click_times % 2 == 0) {
            focus = true
            basic.showIcon(IconNames.Sword)
        } else {
            focus = false
            basic.showIcon(IconNames.Happy)
        }
        begin_stamp = input.runningTime()
    }
})
function 调整时长 () {
    while (!(input.buttonIsPressed(Button.B))) {
        if (input.buttonIsPressed(Button.A)) {
            if (input.acceleration(Dimension.X) >= 0) {
                focus_time += 60
            } else {
                focus_time += -60
            }
            tm.showNumber(focus_time / 60)
        }
        if (focus_time / 60 <= 1 || focus_time / 60 >= 60) {
            focus_time = 60
        }
        basic.pause(200)
    }
}
let begin_stamp = 0
let tm: TM1637.TM1637LEDs = null
let ready = false
let button_a_click_times = 0
let focus = false
let focus_time = 0
// 专注时长，单位秒
focus_time = 25 * 60
// 休息时长，单位秒
let break_time = 10 * 60
// 专注模式true还是休息模式false
focus = true
button_a_click_times = 1
let time_collapse = 0
ready = false
tm = TM1637.create(
DigitalPin.P1,
DigitalPin.P2,
7,
4
)
调整时长()
ready = true
basic.forever(function () {
    time_collapse = input.runningTime() - begin_stamp
    if (focus) {
        if (focus_time == Math.idiv(time_collapse, 1000)) {
            music.startMelody(music.builtInMelody(Melodies.JumpUp), MelodyOptions.Once)
        }
    } else {
        if (break_time == Math.idiv(time_collapse, 1000)) {
            music.startMelody(music.builtInMelody(Melodies.JumpDown), MelodyOptions.Once)
        }
    }
    tm.intensity(Math.map(input.lightLevel(), 0, 255, 0, 10))
    led.setBrightness(Math.map(input.lightLevel(), 0, 255, 0, 255))
    seconds2HHMMSS(Math.idiv(time_collapse, 1000))
})
