import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { QuillService } from './quill.service';
import { OnChanges, SimpleChanges } from '@angular/core';
export declare class QuillViewHTMLComponent implements OnChanges {
    private sanitizer;
    protected service: QuillService;
    content: string;
    theme?: string;
    sanitize: boolean;
    innerHTML: SafeHtml;
    themeClass: string;
    constructor(sanitizer: DomSanitizer, service: QuillService);
    ngOnChanges(changes: SimpleChanges): void;
}
