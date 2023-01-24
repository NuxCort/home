import { animate, AnimationTriggerMetadata, style, transition, trigger } from "@angular/animations";

export class Animations {

    public static readonly fadeInOut: AnimationTriggerMetadata =
        trigger("fadeInOut", [
            transition("void => *",
                [
                    style({ transform: "scaleX(0.9)", opacity: 0 }),
                    animate(100, style({ transform: "scaleX(1)", opacity: 1 }))
                ]),
            transition("* => void",
                [
                    style({ transform: "scaleX(1)", opacity: 1 })
                    // animate(50, style({ transform: 'scaleX(0.1)', opacity: 0 }))
                ])
        ]
        );

    public static readonly leftSlidePanel: AnimationTriggerMetadata =
        trigger("leftSlidePanel",
            [
                transition("void => *",
                    [
                        style({ transform: "translateX(-100%)" }),
                        animate(100, style({ transform: "translateX(0)" }))
                    ]),
                transition("* => void",
                    [
                        style({ transform: "translateX(0)" }),
                        animate(100, style({ transform: "translateX(-100%)" }))
                    ])
            ]
        );

    public static readonly rightSlidePanel: AnimationTriggerMetadata =
        trigger("rightSlidePanel",
            [
                transition("void => *",
                    [
                        style({ transform: "translateX(100%)" }),
                        animate(100, style({ transform: "translateX(0)" }))
                    ]),
                transition("* => void",
                    [
                        style({ transform: "translateX(0)" }),
                        animate(100, style({ transform: "translateX(100%)" }))
                    ])
            ]
        );

    public static readonly topSlidePanel: AnimationTriggerMetadata =
        trigger("topSlidePanel",
            [
                transition("void => *",
                    [
                        style({ transform: "translateY(-20%)", opacity: 0.1 }),
                        animate(100, style({ transform: "translateY(0)", opacity: 1 }))
                    ]),
                transition("* => void", [
                    style({ transform: "translateY(0)", opacity: 1 }),
                    animate(100, style({ transform: "translateY(20%)", opacity: 0.1 }))
                ])
            ]
        );

    public static readonly bottomSlidePanel: AnimationTriggerMetadata =
        trigger("bottomSlidePanel",
            [
                transition("void => *",
                    [
                        style({ transform: "translateY(20%)", opacity: 0.1 }),
                        animate(100, style({ transform: "translateY(0)", opacity: 1 }))
                    ]),
            ]
        );

    public static readonly counterAnimation: AnimationTriggerMetadata =
        trigger("counterAnimation",
            [
                transition("void => *", [style({ transform: "scaleY(0.1)", opacity: 0 }), animate(100, style({ transform: "scaleY(1)", opacity: 1 }))]),
                transition("* => void", [animate(100, style({ opacity: 0 }))])
            ]);

    public static readonly modalInitAnimation: AnimationTriggerMetadata =
        trigger("modalInitAnimation",
            [
                transition("void => *",
                    [
                        style({ transform: "translateY(-20%)" }),
                        animate(100, style({ transform: "translateY(0)" }))
                    ]),
                transition("* => void",
                    [
                        style({ transform: "translateY(0)" }),
                        animate(100, style({ transform: "translateY(-20%)" }))
                    ])
            ]
        );

    public static readonly rightSlideIn: AnimationTriggerMetadata =
        trigger("rightSlideIn",
            [
                transition("void => *",
                    [
                        style({ transform: "translateX(100%)" }),
                        animate(200, style({ transform: "translateX(0)" }))
                    ])
            ]
        );

    public static readonly leftSlideIn: AnimationTriggerMetadata =
        trigger("leftSlideIn",
            [
                transition("void => *",
                    [
                        style({ transform: "translateX(-100%)" }),
                        animate(200, style({ transform: "translateX(0)" }))
                    ])
            ]
        );

    public static readonly leftSlideOut: AnimationTriggerMetadata =
        trigger("leftSlideOut",
            [
                transition("* => void",
                    [
                        style({ transform: "translateX(0)" }),
                        animate(200, style({ transform: "translateX(100%)" }))
                    ])
            ]
        );

}
