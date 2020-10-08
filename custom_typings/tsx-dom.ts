
interface ICommonElement<T> {
    className?: string;
    key?:number|string;
    ref?:(el:T)=>void;
}

type Font = {
    type: 'Font'
}


declare namespace JSX {
    // tslint:disable-next-line:interface-name
    export interface IntrinsicElements {
        a: ICommonElement<HTMLAnchorElement> & Partial<HTMLAnchorElement>;
        abbr: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        address: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        area: ICommonElement<HTMLAreaElement> & Partial<HTMLAreaElement>;
        article: ICommonElement<HTMLAreaElement> & Partial<HTMLElement>;
        aside: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        audio: ICommonElement<HTMLAudioElement> & Partial<HTMLAudioElement>;
        b: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        base: ICommonElement<HTMLBaseElement> & Partial<HTMLBaseElement>;
        bdi: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        bdo: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        big: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        blockquote: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        body: ICommonElement<HTMLBodyElement> & Partial<HTMLBodyElement>;
        br: ICommonElement<HTMLBRElement> & Partial<HTMLBRElement>;
        button: ICommonElement<HTMLButtonElement> & Partial<HTMLButtonElement>;
        canvas: ICommonElement<HTMLCanvasElement> & Partial<HTMLCanvasElement>;
        caption: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        cite: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        code: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        col: ICommonElement<HTMLTableColElement> & Partial<HTMLTableColElement>;
        colgroup: ICommonElement<HTMLTableColElement> & Partial<HTMLTableColElement>;
        data: ICommonElement<HTMLDataElement> & Partial<HTMLDataElement>;
        datalist: ICommonElement<HTMLDataListElement> & Partial<HTMLDataListElement>;
        dd: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        del: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        details: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        dfn: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        dialog: ICommonElement<HTMLDialogElement> & Partial<HTMLDialogElement>;
        div: ICommonElement<HTMLDivElement> & Partial<HTMLDivElement>;
        dl: ICommonElement<HTMLDListElement> & Partial<HTMLDListElement>;
        dt: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        em: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        embed: ICommonElement<HTMLEmbedElement> & Partial<HTMLEmbedElement>;
        fieldset: ICommonElement<HTMLFieldSetElement> & Partial<HTMLFieldSetElement>;
        figcaption: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        figure: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        footer: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        form: ICommonElement<HTMLFormElement> & Partial<HTMLFormElement>;
        h1: ICommonElement<HTMLHeadingElement> & Partial<HTMLHeadingElement>;
        h2: ICommonElement<HTMLHeadingElement> & Partial<HTMLHeadingElement>;
        h3: ICommonElement<HTMLHeadingElement> & Partial<HTMLHeadingElement>;
        h4: ICommonElement<HTMLHeadingElement> & Partial<HTMLHeadingElement>;
        h5: ICommonElement<HTMLHeadingElement> & Partial<HTMLHeadingElement>;
        h6: ICommonElement<HTMLHeadingElement> & Partial<HTMLHeadingElement>;
        head: ICommonElement<HTMLHeadElement> & Partial<HTMLHeadElement>;
        header: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        hgroup: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        hr: ICommonElement<HTMLHRElement> & Partial<HTMLHRElement>;
        html: ICommonElement<HTMLHtmlElement> & Partial<HTMLHtmlElement>;
        i: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        iframe: ICommonElement<HTMLIFrameElement> & Partial<HTMLIFrameElement>;
        img: ICommonElement<HTMLImageElement> & Partial<HTMLImageElement>;
        input: ICommonElement<HTMLInputElement> & Partial<HTMLInputElement>;
        ins: ICommonElement<HTMLModElement> & Partial<HTMLModElement>;
        kbd: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        keygen: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        label: ICommonElement<HTMLLabelElement> & Partial<HTMLLabelElement & {htmlFor?:string|null}>;
        legend: ICommonElement<HTMLLegendElement> & Partial<HTMLLegendElement>;
        li: ICommonElement<HTMLLIElement> & Partial<HTMLLIElement>;
        link: ICommonElement<HTMLLinkElement> & Partial<HTMLLinkElement>;
        main: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        map: ICommonElement<HTMLMapElement> & Partial<HTMLMapElement>;
        mark: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        menu: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        menuitem: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        meta: ICommonElement<HTMLMetaElement> & Partial<HTMLMetaElement>;
        meter: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        nav: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        noindex: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        noscript: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        object: ICommonElement<HTMLObjectElement> & Partial<HTMLObjectElement>;
        ol: ICommonElement<HTMLOListElement> & Partial<HTMLOListElement>;
        optgroup: ICommonElement<HTMLOptGroupElement> & Partial<HTMLOptGroupElement>;
        option: ICommonElement<HTMLOptionElement> & Partial<HTMLOptionElement>;
        output: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        p: ICommonElement<HTMLParagraphElement> & Partial<HTMLParagraphElement>;
        param: ICommonElement<HTMLParamElement> & Partial<HTMLParamElement>;
        picture: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        pre: ICommonElement<HTMLPreElement> & Partial<HTMLPreElement>;
        progress: ICommonElement<HTMLProgressElement> & Partial<HTMLProgressElement>;
        q: ICommonElement<HTMLQuoteElement> & Partial<HTMLQuoteElement>;
        rp: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        rt: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        ruby: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        s: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        samp: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        slot: ICommonElement<HTMLSlotElement> & Partial<HTMLSlotElement>;
        script: ICommonElement<HTMLScriptElement> & Partial<HTMLScriptElement>;
        section: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        select: ICommonElement<HTMLSelectElement> & Partial<HTMLSelectElement>;
        small: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        source: ICommonElement<HTMLSourceElement> & Partial<HTMLSourceElement>;
        span: ICommonElement<HTMLSpanElement> & Partial<HTMLSpanElement>;
        strong: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        style: ICommonElement<HTMLElement> & Partial<HTMLStyleElement>;
        sub: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        summary: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        sup: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        table: ICommonElement<HTMLTableElement> & Partial<HTMLTableElement>;
        template: ICommonElement<HTMLTemplateElement> & Partial<HTMLTemplateElement>;
        tbody: ICommonElement<HTMLTableSectionElement> & Partial<HTMLTableSectionElement>;
        td: ICommonElement<HTMLTableDataCellElement> & Partial<HTMLTableDataCellElement>;
        textarea: ICommonElement<HTMLTextAreaElement> & Partial<HTMLTextAreaElement>;
        tfoot: ICommonElement<HTMLTableSectionElement> & Partial<HTMLTableSectionElement>;
        th: ICommonElement<HTMLTableHeaderCellElement> & Partial<HTMLTableHeaderCellElement>;
        thead: ICommonElement<HTMLTableSectionElement> & Partial<HTMLTableSectionElement>;
        time: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        title: ICommonElement<HTMLTitleElement> & Partial<HTMLTitleElement>;
        tr: ICommonElement<HTMLTableRowElement> & Partial<HTMLTableRowElement>;
        track: ICommonElement<HTMLTrackElement> & Partial<HTMLTrackElement>;
        u: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        ul: ICommonElement<HTMLUListElement> & Partial<HTMLUListElement>;
        "var": ICommonElement<HTMLElement> & Partial<HTMLElement>;
        video: ICommonElement<HTMLVideoElement> & Partial<HTMLVideoElement>;
        wbr: ICommonElement<HTMLElement> & Partial<HTMLElement>;
        font:ICommonElement<HTMLElement> & Partial<{color:IColor, size:number,font:Font}>
    }
}
