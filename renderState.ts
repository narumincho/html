import * as v from "./view";

export class RenderState<Message> {
  private messageData: v.MessageData<Message> = {
    messageMap: new Map(),
    pointerMove: undefined,
    pointerDown: undefined,
  };

  /**
   * イベントを受け取る関数の指定をして, ブラウザで描画する前の準備をする
   *  @param messageHandler メッセージーを受け取る関数
   */
  constructor(private messageHandler: (message: Message) => void) {
    this.messageHandler = messageHandler;
  }

  clickEventHandler(path: string, mouseEvent: MouseEvent): void {
    const eventData = this.messageData.messageMap.get(path);
    if (eventData === undefined) {
      return;
    }
    const messageData = eventData.onClick;
    if (messageData === undefined) {
      return;
    }
    if (messageData.ignoreNewTab) {
      /*
       * リンクを
       * Ctrlなどを押しながらクリックか,
       * マウスの中ボタンでクリックした場合などは, ブラウザで新しいタブが開くので, ブラウザでページ推移をしない.
       */
      if (
        mouseEvent.ctrlKey ||
        mouseEvent.metaKey ||
        mouseEvent.shiftKey ||
        mouseEvent.button !== 0
      ) {
        return;
      }
      mouseEvent.preventDefault();
    }
    if (messageData.stopPropagation) {
      mouseEvent.stopPropagation();
    }
    this.messageHandler(messageData.message);
  }

  changeEventHandler(path: string): void {
    const eventData = this.messageData.messageMap.get(path);
    if (eventData === undefined) {
      return;
    }
    const messageData = eventData.onChange;
    if (messageData === undefined) {
      return;
    }
    this.messageHandler(messageData);
  }

  inputEventHandler(path: string, inputEvent: InputEvent): void {
    const eventData = this.messageData.messageMap.get(path);
    if (eventData === undefined) {
      return;
    }
    const messageData = eventData.onInput;
    if (messageData === undefined) {
      return;
    }
    this.messageHandler(
      messageData(
        (inputEvent.target as HTMLInputElement | HTMLTextAreaElement).value
      )
    );
  }

  setMessageDataMap(messageData: v.MessageData<Message>): void {
    this.messageData = messageData;
  }

  pointerMoveHandler(pointerEvent: PointerEvent): void {
    if (this.messageData.pointerMove !== undefined) {
      this.messageHandler(
        this.messageData.pointerMove(pointerEventToPointer(pointerEvent))
      );
    }
  }

  pointerDownHandler(pointerEvent: PointerEvent): void {
    if (this.messageData.pointerDown !== undefined) {
      this.messageHandler(
        this.messageData.pointerDown(pointerEventToPointer(pointerEvent))
      );
    }
  }
}

const pointerEventToPointer = (pointerEvent: PointerEvent): v.Pointer => {
  return {
    x: pointerEvent.clientX,
    y: pointerEvent.clientY,
    width: pointerEvent.width,
    height: pointerEvent.height,
    isPrimary: pointerEvent.isPrimary,
    pointerId: pointerEvent.pointerId,
    pointerType: pointerTypeToSimple(pointerEvent.pointerType),
    pressure: pointerEvent.pressure,
    tangentialPressure: pointerEvent.tangentialPressure,
    tiltX: pointerEvent.tiltX,
    tiltY: pointerEvent.tiltY,
    twist: pointerEvent.twist,
  };
};

const pointerTypeToSimple = (pointerType: string): v.PointerType => {
  if (
    pointerType === "mouse" ||
    pointerType === "pen" ||
    pointerType === "touch" ||
    pointerType === ""
  ) {
    return pointerType;
  }
  console.info("仕様書で定められていない pointerTypeだ", pointerType);
  return "";
};
