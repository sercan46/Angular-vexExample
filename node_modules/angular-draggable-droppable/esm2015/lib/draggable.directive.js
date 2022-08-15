/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Directive, ElementRef, Renderer2, Output, EventEmitter, Input, NgZone, Inject, TemplateRef, ViewContainerRef, Optional, } from '@angular/core';
import { Subject, Observable, merge, ReplaySubject, combineLatest, fromEvent, } from 'rxjs';
import { map, mergeMap, takeUntil, take, takeLast, pairwise, share, filter, count, startWith, } from 'rxjs/operators';
import { DraggableHelper } from './draggable-helper.provider';
import { DOCUMENT } from '@angular/common';
import autoScroll from '@mattlewis92/dom-autoscroller';
import { DraggableScrollContainerDirective } from './draggable-scroll-container.directive';
import { addClass, removeClass } from './util';
/**
 * @record
 */
export function Coordinates() { }
if (false) {
    /** @type {?} */
    Coordinates.prototype.x;
    /** @type {?} */
    Coordinates.prototype.y;
}
/**
 * @record
 */
export function DragAxis() { }
if (false) {
    /** @type {?} */
    DragAxis.prototype.x;
    /** @type {?} */
    DragAxis.prototype.y;
}
/**
 * @record
 */
export function SnapGrid() { }
if (false) {
    /** @type {?|undefined} */
    SnapGrid.prototype.x;
    /** @type {?|undefined} */
    SnapGrid.prototype.y;
}
/**
 * @record
 */
export function DragPointerDownEvent() { }
/**
 * @record
 */
export function DragStartEvent() { }
if (false) {
    /** @type {?} */
    DragStartEvent.prototype.cancelDrag$;
}
/**
 * @record
 */
export function DragMoveEvent() { }
/**
 * @record
 */
export function DragEndEvent() { }
if (false) {
    /** @type {?} */
    DragEndEvent.prototype.dragCancelled;
}
/**
 * @record
 */
export function ValidateDragParams() { }
if (false) {
    /** @type {?} */
    ValidateDragParams.prototype.transform;
}
/**
 * @record
 */
export function PointerEvent() { }
if (false) {
    /** @type {?} */
    PointerEvent.prototype.clientX;
    /** @type {?} */
    PointerEvent.prototype.clientY;
    /** @type {?} */
    PointerEvent.prototype.event;
}
/**
 * @record
 */
export function TimeLongPress() { }
if (false) {
    /** @type {?} */
    TimeLongPress.prototype.timerBegin;
    /** @type {?} */
    TimeLongPress.prototype.timerEnd;
}
/**
 * @record
 */
export function GhostElementCreatedEvent() { }
if (false) {
    /** @type {?} */
    GhostElementCreatedEvent.prototype.clientX;
    /** @type {?} */
    GhostElementCreatedEvent.prototype.clientY;
    /** @type {?} */
    GhostElementCreatedEvent.prototype.element;
}
export class DraggableDirective {
    /**
     * @hidden
     * @param {?} element
     * @param {?} renderer
     * @param {?} draggableHelper
     * @param {?} zone
     * @param {?} vcr
     * @param {?} scrollContainer
     * @param {?} document
     */
    constructor(element, renderer, draggableHelper, zone, vcr, scrollContainer, document) {
        this.element = element;
        this.renderer = renderer;
        this.draggableHelper = draggableHelper;
        this.zone = zone;
        this.vcr = vcr;
        this.scrollContainer = scrollContainer;
        this.document = document;
        /**
         * The axis along which the element is draggable
         */
        this.dragAxis = { x: true, y: true };
        /**
         * Snap all drags to an x / y grid
         */
        this.dragSnapGrid = {};
        /**
         * Show a ghost element that shows the drag when dragging
         */
        this.ghostDragEnabled = true;
        /**
         * Show the original element when ghostDragEnabled is true
         */
        this.showOriginalElementWhileDragging = false;
        /**
         * The cursor to use when hovering over a draggable element
         */
        this.dragCursor = '';
        /*
           * Options used to control the behaviour of auto scrolling: https://www.npmjs.com/package/dom-autoscroller
           */
        this.autoScroll = {
            margin: 20,
        };
        /**
         * Called when the element can be dragged along one axis and has the mouse or pointer device pressed on it
         */
        this.dragPointerDown = new EventEmitter();
        /**
         * Called when the element has started to be dragged.
         * Only called after at least one mouse or touch move event.
         * If you call $event.cancelDrag$.emit() it will cancel the current drag
         */
        this.dragStart = new EventEmitter();
        /**
         * Called after the ghost element has been created
         */
        this.ghostElementCreated = new EventEmitter();
        /**
         * Called when the element is being dragged
         */
        this.dragging = new EventEmitter();
        /**
         * Called after the element is dragged
         */
        this.dragEnd = new EventEmitter();
        /**
         * @hidden
         */
        this.pointerDown$ = new Subject();
        /**
         * @hidden
         */
        this.pointerMove$ = new Subject();
        /**
         * @hidden
         */
        this.pointerUp$ = new Subject();
        this.eventListenerSubscriptions = {};
        this.destroy$ = new Subject();
        this.timeLongPress = { timerBegin: 0, timerEnd: 0 };
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.checkEventListeners();
        /** @type {?} */
        const pointerDragged$ = this.pointerDown$.pipe(filter((/**
         * @return {?}
         */
        () => this.canDrag())), mergeMap((/**
         * @param {?} pointerDownEvent
         * @return {?}
         */
        (pointerDownEvent) => {
            // fix for https://github.com/mattlewis92/angular-draggable-droppable/issues/61
            // stop mouse events propagating up the chain
            if (pointerDownEvent.event.stopPropagation && !this.scrollContainer) {
                pointerDownEvent.event.stopPropagation();
            }
            // hack to prevent text getting selected in safari while dragging
            /** @type {?} */
            const globalDragStyle = this.renderer.createElement('style');
            this.renderer.setAttribute(globalDragStyle, 'type', 'text/css');
            this.renderer.appendChild(globalDragStyle, this.renderer.createText(`
          body * {
           -moz-user-select: none;
           -ms-user-select: none;
           -webkit-user-select: none;
           user-select: none;
          }
        `));
            requestAnimationFrame((/**
             * @return {?}
             */
            () => {
                this.document.head.appendChild(globalDragStyle);
            }));
            /** @type {?} */
            const startScrollPosition = this.getScrollPosition();
            /** @type {?} */
            const scrollContainerScroll$ = new Observable((/**
             * @param {?} observer
             * @return {?}
             */
            (observer) => {
                /** @type {?} */
                const scrollContainer = this.scrollContainer
                    ? this.scrollContainer.elementRef.nativeElement
                    : 'window';
                return this.renderer.listen(scrollContainer, 'scroll', (/**
                 * @param {?} e
                 * @return {?}
                 */
                (e) => observer.next(e)));
            })).pipe(startWith(startScrollPosition), map((/**
             * @return {?}
             */
            () => this.getScrollPosition())));
            /** @type {?} */
            const currentDrag$ = new Subject();
            /** @type {?} */
            const cancelDrag$ = new ReplaySubject();
            this.zone.run((/**
             * @return {?}
             */
            () => {
                this.dragPointerDown.next({ x: 0, y: 0 });
            }));
            /** @type {?} */
            const dragComplete$ = merge(this.pointerUp$, this.pointerDown$, cancelDrag$, this.destroy$).pipe(share());
            /** @type {?} */
            const pointerMove = combineLatest([
                this.pointerMove$,
                scrollContainerScroll$,
            ]).pipe(map((/**
             * @param {?} __0
             * @return {?}
             */
            ([pointerMoveEvent, scroll]) => {
                return {
                    currentDrag$,
                    transformX: pointerMoveEvent.clientX - pointerDownEvent.clientX,
                    transformY: pointerMoveEvent.clientY - pointerDownEvent.clientY,
                    clientX: pointerMoveEvent.clientX,
                    clientY: pointerMoveEvent.clientY,
                    scrollLeft: scroll.left,
                    scrollTop: scroll.top,
                };
            })), map((/**
             * @param {?} moveData
             * @return {?}
             */
            (moveData) => {
                if (this.dragSnapGrid.x) {
                    moveData.transformX =
                        Math.round(moveData.transformX / this.dragSnapGrid.x) *
                            this.dragSnapGrid.x;
                }
                if (this.dragSnapGrid.y) {
                    moveData.transformY =
                        Math.round(moveData.transformY / this.dragSnapGrid.y) *
                            this.dragSnapGrid.y;
                }
                return moveData;
            })), map((/**
             * @param {?} moveData
             * @return {?}
             */
            (moveData) => {
                if (!this.dragAxis.x) {
                    moveData.transformX = 0;
                }
                if (!this.dragAxis.y) {
                    moveData.transformY = 0;
                }
                return moveData;
            })), map((/**
             * @param {?} moveData
             * @return {?}
             */
            (moveData) => {
                /** @type {?} */
                const scrollX = moveData.scrollLeft - startScrollPosition.left;
                /** @type {?} */
                const scrollY = moveData.scrollTop - startScrollPosition.top;
                return Object.assign({}, moveData, { x: moveData.transformX + scrollX, y: moveData.transformY + scrollY });
            })), filter((/**
             * @param {?} __0
             * @return {?}
             */
            ({ x, y, transformX, transformY }) => !this.validateDrag ||
                this.validateDrag({
                    x,
                    y,
                    transform: { x: transformX, y: transformY },
                }))), takeUntil(dragComplete$), share());
            /** @type {?} */
            const dragStarted$ = pointerMove.pipe(take(1), share());
            /** @type {?} */
            const dragEnded$ = pointerMove.pipe(takeLast(1), share());
            dragStarted$.subscribe((/**
             * @param {?} __0
             * @return {?}
             */
            ({ clientX, clientY, x, y }) => {
                this.zone.run((/**
                 * @return {?}
                 */
                () => {
                    this.dragStart.next({ cancelDrag$ });
                }));
                this.scroller = autoScroll([
                    this.scrollContainer
                        ? this.scrollContainer.elementRef.nativeElement
                        : this.document.defaultView,
                ], Object.assign({}, this.autoScroll, { /**
                     * @return {?}
                     */
                    autoScroll() {
                        return true;
                    } }));
                addClass(this.renderer, this.element, this.dragActiveClass);
                if (this.ghostDragEnabled) {
                    /** @type {?} */
                    const rect = this.element.nativeElement.getBoundingClientRect();
                    /** @type {?} */
                    const clone = (/** @type {?} */ (this.element.nativeElement.cloneNode(true)));
                    if (!this.showOriginalElementWhileDragging) {
                        this.renderer.setStyle(this.element.nativeElement, 'visibility', 'hidden');
                    }
                    if (this.ghostElementAppendTo) {
                        this.ghostElementAppendTo.appendChild(clone);
                    }
                    else {
                        (/** @type {?} */ (this.element.nativeElement.parentNode)).insertBefore(clone, this.element.nativeElement.nextSibling);
                    }
                    this.ghostElement = clone;
                    this.document.body.style.cursor = this.dragCursor;
                    this.setElementStyles(clone, {
                        position: 'fixed',
                        top: `${rect.top}px`,
                        left: `${rect.left}px`,
                        width: `${rect.width}px`,
                        height: `${rect.height}px`,
                        cursor: this.dragCursor,
                        margin: '0',
                        willChange: 'transform',
                        pointerEvents: 'none',
                    });
                    if (this.ghostElementTemplate) {
                        /** @type {?} */
                        const viewRef = this.vcr.createEmbeddedView(this.ghostElementTemplate);
                        clone.innerHTML = '';
                        viewRef.rootNodes
                            .filter((/**
                         * @param {?} node
                         * @return {?}
                         */
                        (node) => node instanceof Node))
                            .forEach((/**
                         * @param {?} node
                         * @return {?}
                         */
                        (node) => {
                            clone.appendChild(node);
                        }));
                        dragEnded$.subscribe((/**
                         * @return {?}
                         */
                        () => {
                            this.vcr.remove(this.vcr.indexOf(viewRef));
                        }));
                    }
                    this.zone.run((/**
                     * @return {?}
                     */
                    () => {
                        this.ghostElementCreated.emit({
                            clientX: clientX - x,
                            clientY: clientY - y,
                            element: clone,
                        });
                    }));
                    dragEnded$.subscribe((/**
                     * @return {?}
                     */
                    () => {
                        (/** @type {?} */ (clone.parentElement)).removeChild(clone);
                        this.ghostElement = null;
                        this.renderer.setStyle(this.element.nativeElement, 'visibility', '');
                    }));
                }
                this.draggableHelper.currentDrag.next(currentDrag$);
            }));
            dragEnded$
                .pipe(mergeMap((/**
             * @param {?} dragEndData
             * @return {?}
             */
            (dragEndData) => {
                /** @type {?} */
                const dragEndData$ = cancelDrag$.pipe(count(), take(1), map((/**
                 * @param {?} calledCount
                 * @return {?}
                 */
                (calledCount) => (Object.assign({}, dragEndData, { dragCancelled: calledCount > 0 })))));
                cancelDrag$.complete();
                return dragEndData$;
            })))
                .subscribe((/**
             * @param {?} __0
             * @return {?}
             */
            ({ x, y, dragCancelled }) => {
                this.scroller.destroy();
                this.zone.run((/**
                 * @return {?}
                 */
                () => {
                    this.dragEnd.next({ x, y, dragCancelled });
                }));
                removeClass(this.renderer, this.element, this.dragActiveClass);
                currentDrag$.complete();
            }));
            merge(dragComplete$, dragEnded$)
                .pipe(take(1))
                .subscribe((/**
             * @return {?}
             */
            () => {
                requestAnimationFrame((/**
                 * @return {?}
                 */
                () => {
                    this.document.head.removeChild(globalDragStyle);
                }));
            }));
            return pointerMove;
        })), share());
        merge(pointerDragged$.pipe(take(1), map((/**
         * @param {?} value
         * @return {?}
         */
        (value) => [, value]))), pointerDragged$.pipe(pairwise()))
            .pipe(filter((/**
         * @param {?} __0
         * @return {?}
         */
        ([previous, next]) => {
            if (!previous) {
                return true;
            }
            return previous.x !== next.x || previous.y !== next.y;
        })), map((/**
         * @param {?} __0
         * @return {?}
         */
        ([previous, next]) => next)))
            .subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        ({ x, y, currentDrag$, clientX, clientY, transformX, transformY }) => {
            this.zone.run((/**
             * @return {?}
             */
            () => {
                this.dragging.next({ x, y });
            }));
            requestAnimationFrame((/**
             * @return {?}
             */
            () => {
                if (this.ghostElement) {
                    /** @type {?} */
                    const transform = `translate3d(${transformX}px, ${transformY}px, 0px)`;
                    this.setElementStyles(this.ghostElement, {
                        transform,
                        '-webkit-transform': transform,
                        '-ms-transform': transform,
                        '-moz-transform': transform,
                        '-o-transform': transform,
                    });
                }
            }));
            currentDrag$.next({
                clientX,
                clientY,
                dropData: this.dropData,
            });
        }));
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes.dragAxis) {
            this.checkEventListeners();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.unsubscribeEventListeners();
        this.pointerDown$.complete();
        this.pointerMove$.complete();
        this.pointerUp$.complete();
        this.destroy$.next();
    }
    /**
     * @private
     * @return {?}
     */
    checkEventListeners() {
        /** @type {?} */
        const canDrag = this.canDrag();
        /** @type {?} */
        const hasEventListeners = Object.keys(this.eventListenerSubscriptions).length > 0;
        if (canDrag && !hasEventListeners) {
            this.zone.runOutsideAngular((/**
             * @return {?}
             */
            () => {
                this.eventListenerSubscriptions.mousedown = this.renderer.listen(this.element.nativeElement, 'mousedown', (/**
                 * @param {?} event
                 * @return {?}
                 */
                (event) => {
                    this.onMouseDown(event);
                }));
                this.eventListenerSubscriptions.mouseup = this.renderer.listen('document', 'mouseup', (/**
                 * @param {?} event
                 * @return {?}
                 */
                (event) => {
                    this.onMouseUp(event);
                }));
                this.eventListenerSubscriptions.touchstart = this.renderer.listen(this.element.nativeElement, 'touchstart', (/**
                 * @param {?} event
                 * @return {?}
                 */
                (event) => {
                    this.onTouchStart(event);
                }));
                this.eventListenerSubscriptions.touchend = this.renderer.listen('document', 'touchend', (/**
                 * @param {?} event
                 * @return {?}
                 */
                (event) => {
                    this.onTouchEnd(event);
                }));
                this.eventListenerSubscriptions.touchcancel = this.renderer.listen('document', 'touchcancel', (/**
                 * @param {?} event
                 * @return {?}
                 */
                (event) => {
                    this.onTouchEnd(event);
                }));
                this.eventListenerSubscriptions.mouseenter = this.renderer.listen(this.element.nativeElement, 'mouseenter', (/**
                 * @return {?}
                 */
                () => {
                    this.onMouseEnter();
                }));
                this.eventListenerSubscriptions.mouseleave = this.renderer.listen(this.element.nativeElement, 'mouseleave', (/**
                 * @return {?}
                 */
                () => {
                    this.onMouseLeave();
                }));
            }));
        }
        else if (!canDrag && hasEventListeners) {
            this.unsubscribeEventListeners();
        }
    }
    /**
     * @private
     * @param {?} event
     * @return {?}
     */
    onMouseDown(event) {
        if (event.button === 0) {
            if (!this.eventListenerSubscriptions.mousemove) {
                this.eventListenerSubscriptions.mousemove = this.renderer.listen('document', 'mousemove', (/**
                 * @param {?} mouseMoveEvent
                 * @return {?}
                 */
                (mouseMoveEvent) => {
                    this.pointerMove$.next({
                        event: mouseMoveEvent,
                        clientX: mouseMoveEvent.clientX,
                        clientY: mouseMoveEvent.clientY,
                    });
                }));
            }
            this.pointerDown$.next({
                event,
                clientX: event.clientX,
                clientY: event.clientY,
            });
        }
    }
    /**
     * @private
     * @param {?} event
     * @return {?}
     */
    onMouseUp(event) {
        if (event.button === 0) {
            if (this.eventListenerSubscriptions.mousemove) {
                this.eventListenerSubscriptions.mousemove();
                delete this.eventListenerSubscriptions.mousemove;
            }
            this.pointerUp$.next({
                event,
                clientX: event.clientX,
                clientY: event.clientY,
            });
        }
    }
    /**
     * @private
     * @param {?} event
     * @return {?}
     */
    onTouchStart(event) {
        /** @type {?} */
        let startScrollPosition;
        /** @type {?} */
        let isDragActivated;
        /** @type {?} */
        let hasContainerScrollbar;
        if ((this.scrollContainer && this.scrollContainer.activeLongPressDrag) ||
            this.touchStartLongPress) {
            this.timeLongPress.timerBegin = Date.now();
            isDragActivated = false;
            hasContainerScrollbar = this.hasScrollbar();
            startScrollPosition = this.getScrollPosition();
        }
        if (!this.eventListenerSubscriptions.touchmove) {
            /** @type {?} */
            const contextMenuListener = fromEvent(this.document, 'contextmenu').subscribe((/**
             * @param {?} e
             * @return {?}
             */
            (e) => {
                e.preventDefault();
            }));
            /** @type {?} */
            const touchMoveListener = fromEvent(this.document, 'touchmove', {
                passive: false,
            }).subscribe((/**
             * @param {?} touchMoveEvent
             * @return {?}
             */
            (touchMoveEvent) => {
                if (((this.scrollContainer && this.scrollContainer.activeLongPressDrag) ||
                    this.touchStartLongPress) &&
                    !isDragActivated &&
                    hasContainerScrollbar) {
                    isDragActivated = this.shouldBeginDrag(event, touchMoveEvent, startScrollPosition);
                }
                if (((!this.scrollContainer ||
                    !this.scrollContainer.activeLongPressDrag) &&
                    !this.touchStartLongPress) ||
                    !hasContainerScrollbar ||
                    isDragActivated) {
                    touchMoveEvent.preventDefault();
                    this.pointerMove$.next({
                        event: touchMoveEvent,
                        clientX: touchMoveEvent.targetTouches[0].clientX,
                        clientY: touchMoveEvent.targetTouches[0].clientY,
                    });
                }
            }));
            this.eventListenerSubscriptions.touchmove = (/**
             * @return {?}
             */
            () => {
                contextMenuListener.unsubscribe();
                touchMoveListener.unsubscribe();
            });
        }
        this.pointerDown$.next({
            event,
            clientX: event.touches[0].clientX,
            clientY: event.touches[0].clientY,
        });
    }
    /**
     * @private
     * @param {?} event
     * @return {?}
     */
    onTouchEnd(event) {
        if (this.eventListenerSubscriptions.touchmove) {
            this.eventListenerSubscriptions.touchmove();
            delete this.eventListenerSubscriptions.touchmove;
            if ((this.scrollContainer && this.scrollContainer.activeLongPressDrag) ||
                this.touchStartLongPress) {
                this.enableScroll();
            }
        }
        this.pointerUp$.next({
            event,
            clientX: event.changedTouches[0].clientX,
            clientY: event.changedTouches[0].clientY,
        });
    }
    /**
     * @private
     * @return {?}
     */
    onMouseEnter() {
        this.setCursor(this.dragCursor);
    }
    /**
     * @private
     * @return {?}
     */
    onMouseLeave() {
        this.setCursor('');
    }
    /**
     * @private
     * @return {?}
     */
    canDrag() {
        return this.dragAxis.x || this.dragAxis.y;
    }
    /**
     * @private
     * @param {?} value
     * @return {?}
     */
    setCursor(value) {
        if (!this.eventListenerSubscriptions.mousemove) {
            this.renderer.setStyle(this.element.nativeElement, 'cursor', value);
        }
    }
    /**
     * @private
     * @return {?}
     */
    unsubscribeEventListeners() {
        Object.keys(this.eventListenerSubscriptions).forEach((/**
         * @param {?} type
         * @return {?}
         */
        (type) => {
            ((/** @type {?} */ (this))).eventListenerSubscriptions[type]();
            delete ((/** @type {?} */ (this))).eventListenerSubscriptions[type];
        }));
    }
    /**
     * @private
     * @param {?} element
     * @param {?} styles
     * @return {?}
     */
    setElementStyles(element, styles) {
        Object.keys(styles).forEach((/**
         * @param {?} key
         * @return {?}
         */
        (key) => {
            this.renderer.setStyle(element, key, styles[key]);
        }));
    }
    /**
     * @private
     * @return {?}
     */
    getScrollElement() {
        if (this.scrollContainer) {
            return this.scrollContainer.elementRef.nativeElement;
        }
        else {
            return this.document.body;
        }
    }
    /**
     * @private
     * @return {?}
     */
    getScrollPosition() {
        if (this.scrollContainer) {
            return {
                top: this.scrollContainer.elementRef.nativeElement.scrollTop,
                left: this.scrollContainer.elementRef.nativeElement.scrollLeft,
            };
        }
        else {
            return {
                top: window.pageYOffset || this.document.documentElement.scrollTop,
                left: window.pageXOffset || this.document.documentElement.scrollLeft,
            };
        }
    }
    /**
     * @private
     * @param {?} event
     * @param {?} touchMoveEvent
     * @param {?} startScrollPosition
     * @return {?}
     */
    shouldBeginDrag(event, touchMoveEvent, startScrollPosition) {
        /** @type {?} */
        const moveScrollPosition = this.getScrollPosition();
        /** @type {?} */
        const deltaScroll = {
            top: Math.abs(moveScrollPosition.top - startScrollPosition.top),
            left: Math.abs(moveScrollPosition.left - startScrollPosition.left),
        };
        /** @type {?} */
        const deltaX = Math.abs(touchMoveEvent.targetTouches[0].clientX - event.touches[0].clientX) - deltaScroll.left;
        /** @type {?} */
        const deltaY = Math.abs(touchMoveEvent.targetTouches[0].clientY - event.touches[0].clientY) - deltaScroll.top;
        /** @type {?} */
        const deltaTotal = deltaX + deltaY;
        /** @type {?} */
        const longPressConfig = this.touchStartLongPress
            ? this.touchStartLongPress
            : /* istanbul ignore next */
                {
                    delta: this.scrollContainer.longPressConfig.delta,
                    delay: this.scrollContainer.longPressConfig.duration,
                };
        if (deltaTotal > longPressConfig.delta ||
            deltaScroll.top > 0 ||
            deltaScroll.left > 0) {
            this.timeLongPress.timerBegin = Date.now();
        }
        this.timeLongPress.timerEnd = Date.now();
        /** @type {?} */
        const duration = this.timeLongPress.timerEnd - this.timeLongPress.timerBegin;
        if (duration >= longPressConfig.delay) {
            this.disableScroll();
            return true;
        }
        return false;
    }
    /**
     * @private
     * @return {?}
     */
    enableScroll() {
        if (this.scrollContainer) {
            this.renderer.setStyle(this.scrollContainer.elementRef.nativeElement, 'overflow', '');
        }
        this.renderer.setStyle(this.document.body, 'overflow', '');
    }
    /**
     * @private
     * @return {?}
     */
    disableScroll() {
        /* istanbul ignore next */
        if (this.scrollContainer) {
            this.renderer.setStyle(this.scrollContainer.elementRef.nativeElement, 'overflow', 'hidden');
        }
        this.renderer.setStyle(this.document.body, 'overflow', 'hidden');
    }
    /**
     * @private
     * @return {?}
     */
    hasScrollbar() {
        /** @type {?} */
        const scrollContainer = this.getScrollElement();
        /** @type {?} */
        const containerHasHorizontalScroll = scrollContainer.scrollWidth > scrollContainer.clientWidth;
        /** @type {?} */
        const containerHasVerticalScroll = scrollContainer.scrollHeight > scrollContainer.clientHeight;
        return containerHasHorizontalScroll || containerHasVerticalScroll;
    }
}
DraggableDirective.decorators = [
    { type: Directive, args: [{
                selector: '[mwlDraggable]',
            },] }
];
/** @nocollapse */
DraggableDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: DraggableHelper },
    { type: NgZone },
    { type: ViewContainerRef },
    { type: DraggableScrollContainerDirective, decorators: [{ type: Optional }] },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
];
DraggableDirective.propDecorators = {
    dropData: [{ type: Input }],
    dragAxis: [{ type: Input }],
    dragSnapGrid: [{ type: Input }],
    ghostDragEnabled: [{ type: Input }],
    showOriginalElementWhileDragging: [{ type: Input }],
    validateDrag: [{ type: Input }],
    dragCursor: [{ type: Input }],
    dragActiveClass: [{ type: Input }],
    ghostElementAppendTo: [{ type: Input }],
    ghostElementTemplate: [{ type: Input }],
    touchStartLongPress: [{ type: Input }],
    autoScroll: [{ type: Input }],
    dragPointerDown: [{ type: Output }],
    dragStart: [{ type: Output }],
    ghostElementCreated: [{ type: Output }],
    dragging: [{ type: Output }],
    dragEnd: [{ type: Output }]
};
if (false) {
    /**
     * an object of data you can pass to the drop event
     * @type {?}
     */
    DraggableDirective.prototype.dropData;
    /**
     * The axis along which the element is draggable
     * @type {?}
     */
    DraggableDirective.prototype.dragAxis;
    /**
     * Snap all drags to an x / y grid
     * @type {?}
     */
    DraggableDirective.prototype.dragSnapGrid;
    /**
     * Show a ghost element that shows the drag when dragging
     * @type {?}
     */
    DraggableDirective.prototype.ghostDragEnabled;
    /**
     * Show the original element when ghostDragEnabled is true
     * @type {?}
     */
    DraggableDirective.prototype.showOriginalElementWhileDragging;
    /**
     * Allow custom behaviour to control when the element is dragged
     * @type {?}
     */
    DraggableDirective.prototype.validateDrag;
    /**
     * The cursor to use when hovering over a draggable element
     * @type {?}
     */
    DraggableDirective.prototype.dragCursor;
    /**
     * The css class to apply when the element is being dragged
     * @type {?}
     */
    DraggableDirective.prototype.dragActiveClass;
    /**
     * The element the ghost element will be appended to. Default is next to the dragged element
     * @type {?}
     */
    DraggableDirective.prototype.ghostElementAppendTo;
    /**
     * An ng-template to be inserted into the parent element of the ghost element. It will overwrite any child nodes.
     * @type {?}
     */
    DraggableDirective.prototype.ghostElementTemplate;
    /**
     * Amount of milliseconds to wait on touch devices before starting to drag the element (so that you can scroll the page by touching a draggable element)
     * @type {?}
     */
    DraggableDirective.prototype.touchStartLongPress;
    /** @type {?} */
    DraggableDirective.prototype.autoScroll;
    /**
     * Called when the element can be dragged along one axis and has the mouse or pointer device pressed on it
     * @type {?}
     */
    DraggableDirective.prototype.dragPointerDown;
    /**
     * Called when the element has started to be dragged.
     * Only called after at least one mouse or touch move event.
     * If you call $event.cancelDrag$.emit() it will cancel the current drag
     * @type {?}
     */
    DraggableDirective.prototype.dragStart;
    /**
     * Called after the ghost element has been created
     * @type {?}
     */
    DraggableDirective.prototype.ghostElementCreated;
    /**
     * Called when the element is being dragged
     * @type {?}
     */
    DraggableDirective.prototype.dragging;
    /**
     * Called after the element is dragged
     * @type {?}
     */
    DraggableDirective.prototype.dragEnd;
    /**
     * @hidden
     * @type {?}
     */
    DraggableDirective.prototype.pointerDown$;
    /**
     * @hidden
     * @type {?}
     */
    DraggableDirective.prototype.pointerMove$;
    /**
     * @hidden
     * @type {?}
     */
    DraggableDirective.prototype.pointerUp$;
    /**
     * @type {?}
     * @private
     */
    DraggableDirective.prototype.eventListenerSubscriptions;
    /**
     * @type {?}
     * @private
     */
    DraggableDirective.prototype.ghostElement;
    /**
     * @type {?}
     * @private
     */
    DraggableDirective.prototype.destroy$;
    /**
     * @type {?}
     * @private
     */
    DraggableDirective.prototype.timeLongPress;
    /**
     * @type {?}
     * @private
     */
    DraggableDirective.prototype.scroller;
    /**
     * @type {?}
     * @private
     */
    DraggableDirective.prototype.element;
    /**
     * @type {?}
     * @private
     */
    DraggableDirective.prototype.renderer;
    /**
     * @type {?}
     * @private
     */
    DraggableDirective.prototype.draggableHelper;
    /**
     * @type {?}
     * @private
     */
    DraggableDirective.prototype.zone;
    /**
     * @type {?}
     * @private
     */
    DraggableDirective.prototype.vcr;
    /**
     * @type {?}
     * @private
     */
    DraggableDirective.prototype.scrollContainer;
    /**
     * @type {?}
     * @private
     */
    DraggableDirective.prototype.document;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZ2dhYmxlLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItZHJhZ2dhYmxlLWRyb3BwYWJsZS8iLCJzb3VyY2VzIjpbImxpYi9kcmFnZ2FibGUuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUVULFVBQVUsRUFDVixTQUFTLEVBQ1QsTUFBTSxFQUNOLFlBQVksRUFDWixLQUFLLEVBR0wsTUFBTSxFQUVOLE1BQU0sRUFDTixXQUFXLEVBQ1gsZ0JBQWdCLEVBQ2hCLFFBQVEsR0FDVCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQ0wsT0FBTyxFQUNQLFVBQVUsRUFDVixLQUFLLEVBQ0wsYUFBYSxFQUNiLGFBQWEsRUFDYixTQUFTLEdBQ1YsTUFBTSxNQUFNLENBQUM7QUFDZCxPQUFPLEVBQ0wsR0FBRyxFQUNILFFBQVEsRUFDUixTQUFTLEVBQ1QsSUFBSSxFQUNKLFFBQVEsRUFDUixRQUFRLEVBQ1IsS0FBSyxFQUNMLE1BQU0sRUFDTixLQUFLLEVBQ0wsU0FBUyxHQUNWLE1BQU0sZ0JBQWdCLENBQUM7QUFDeEIsT0FBTyxFQUFtQixlQUFlLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUMvRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxVQUFVLE1BQU0sK0JBQStCLENBQUM7QUFDdkQsT0FBTyxFQUFFLGlDQUFpQyxFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDM0YsT0FBTyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsTUFBTSxRQUFRLENBQUM7Ozs7QUFFL0MsaUNBR0M7OztJQUZDLHdCQUFVOztJQUNWLHdCQUFVOzs7OztBQUdaLDhCQUdDOzs7SUFGQyxxQkFBVzs7SUFDWCxxQkFBVzs7Ozs7QUFHYiw4QkFHQzs7O0lBRkMscUJBQVc7O0lBQ1gscUJBQVc7Ozs7O0FBR2IsMENBQTREOzs7O0FBRTVELG9DQUVDOzs7SUFE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LE1BQU07c0JBS04sTUFBTTs7Ozs7OztJQTVGUCxzQ0FBdUI7Ozs7O0lBS3ZCLHNDQUFtRDs7Ozs7SUFLbkQsMENBQXFDOzs7OztJQUtyQyw4Q0FBMEM7Ozs7O0lBSzFDLDhEQUEyRDs7Ozs7SUFLM0QsMENBQW9DOzs7OztJQUtwQyx3Q0FBaUM7Ozs7O0lBS2pDLDZDQUFpQzs7Ozs7SUFLakMsa0RBQTJDOzs7OztJQUszQyxrREFBZ0Q7Ozs7O0lBS2hELGlEQUErRDs7SUFLL0Qsd0NBVUU7Ozs7O0lBS0YsNkNBQXFFOzs7Ozs7O0lBT3JFLHVDQUF5RDs7Ozs7SUFLekQsaURBQTZFOzs7OztJQUs3RSxzQ0FBdUQ7Ozs7O0lBS3ZELHFDQUFxRDs7Ozs7SUFLckQsMENBQTJDOzs7OztJQUszQywwQ0FBMkM7Ozs7O0lBSzNDLHdDQUF5Qzs7Ozs7SUFFekMsd0RBVU87Ozs7O0lBRVAsMENBQXlDOzs7OztJQUV6QyxzQ0FBaUM7Ozs7O0lBRWpDLDJDQUFzRTs7Ozs7SUFFdEUsc0NBQTBDOzs7OztJQU14QyxxQ0FBd0M7Ozs7O0lBQ3hDLHNDQUEyQjs7Ozs7SUFDM0IsNkNBQXdDOzs7OztJQUN4QyxrQ0FBb0I7Ozs7O0lBQ3BCLGlDQUE2Qjs7Ozs7SUFDN0IsNkNBQXNFOzs7OztJQUN0RSxzQ0FBdUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIE9uSW5pdCxcbiAgRWxlbWVudFJlZixcbiAgUmVuZGVyZXIyLFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT25DaGFuZ2VzLFxuICBOZ1pvbmUsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIEluamVjdCxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIE9wdGlvbmFsLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIFN1YmplY3QsXG4gIE9ic2VydmFibGUsXG4gIG1lcmdlLFxuICBSZXBsYXlTdWJqZWN0LFxuICBjb21iaW5lTGF0ZXN0LFxuICBmcm9tRXZlbnQsXG59IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtcbiAgbWFwLFxuICBtZXJnZU1hcCxcbiAgdGFrZVVudGlsLFxuICB0YWtlLFxuICB0YWtlTGFzdCxcbiAgcGFpcndpc2UsXG4gIHNoYXJlLFxuICBmaWx0ZXIsXG4gIGNvdW50LFxuICBzdGFydFdpdGgsXG59IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEN1cnJlbnREcmFnRGF0YSwgRHJhZ2dhYmxlSGVscGVyIH0gZnJvbSAnLi9kcmFnZ2FibGUtaGVscGVyLnByb3ZpZGVyJztcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCBhdXRvU2Nyb2xsIGZyb20gJ0BtYXR0bGV3aXM5Mi9kb20tYXV0b3Njcm9sbGVyJztcbmltcG9ydCB7IERyYWdnYWJsZVNjcm9sbENvbnRhaW5lckRpcmVjdGl2ZSB9IGZyb20gJy4vZHJhZ2dhYmxlLXNjcm9sbC1jb250YWluZXIuZGlyZWN0aXZlJztcbmltcG9ydCB7IGFkZENsYXNzLCByZW1vdmVDbGFzcyB9IGZyb20gJy4vdXRpbCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29vcmRpbmF0ZXMge1xuICB4OiBudW1iZXI7XG4gIHk6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBEcmFnQXhpcyB7XG4gIHg6IGJvb2xlYW47XG4gIHk6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU25hcEdyaWQge1xuICB4PzogbnVtYmVyO1xuICB5PzogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIERyYWdQb2ludGVyRG93bkV2ZW50IGV4dGVuZHMgQ29vcmRpbmF0ZXMge31cblxuZXhwb3J0IGludGVyZmFjZSBEcmFnU3RhcnRFdmVudCB7XG4gIGNhbmNlbERyYWckOiBSZXBsYXlTdWJqZWN0PHZvaWQ+O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIERyYWdNb3ZlRXZlbnQgZXh0ZW5kcyBDb29yZGluYXRlcyB7fVxuXG5leHBvcnQgaW50ZXJmYWNlIERyYWdFbmRFdmVudCBleHRlbmRzIENvb3JkaW5hdGVzIHtcbiAgZHJhZ0NhbmNlbGxlZDogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBWYWxpZGF0ZURyYWdQYXJhbXMgZXh0ZW5kcyBDb29yZGluYXRlcyB7XG4gIHRyYW5zZm9ybToge1xuICAgIHg6IG51bWJlcjtcbiAgICB5OiBudW1iZXI7XG4gIH07XG59XG5cbmV4cG9ydCB0eXBlIFZhbGlkYXRlRHJhZyA9IChwYXJhbXM6IFZhbGlkYXRlRHJhZ1BhcmFtcykgPT4gYm9vbGVhbjtcblxuZXhwb3J0IGludGVyZmFjZSBQb2ludGVyRXZlbnQge1xuICBjbGllbnRYOiBudW1iZXI7XG4gIGNsaWVudFk6IG51bWJlcjtcbiAgZXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRpbWVMb25nUHJlc3Mge1xuICB0aW1lckJlZ2luOiBudW1iZXI7XG4gIHRpbWVyRW5kOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2hvc3RFbGVtZW50Q3JlYXRlZEV2ZW50IHtcbiAgY2xpZW50WDogbnVtYmVyO1xuICBjbGllbnRZOiBudW1iZXI7XG4gIGVsZW1lbnQ6IEhUTUxFbGVtZW50O1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbXdsRHJhZ2dhYmxlXScsXG59KVxuZXhwb3J0IGNsYXNzIERyYWdnYWJsZURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICAvKipcbiAgICogYW4gb2JqZWN0IG9mIGRhdGEgeW91IGNhbiBwYXNzIHRvIHRoZSBkcm9wIGV2ZW50XG4gICAqL1xuICBASW5wdXQoKSBkcm9wRGF0YTogYW55O1xuXG4gIC8qKlxuICAgKiBUaGUgYXhpcyBhbG9uZyB3aGljaCB0aGUgZWxlbWVudCBpcyBkcmFnZ2FibGVcbiAgICovXG4gIEBJbnB1dCgpIGRyYWdBeGlzOiBEcmFnQXhpcyA9IHsgeDogdHJ1ZSwgeTogdHJ1ZSB9O1xuXG4gIC8qKlxuICAgKiBTbmFwIGFsbCBkcmFncyB0byBhbiB4IC8geSBncmlkXG4gICAqL1xuICBASW5wdXQoKSBkcmFnU25hcEdyaWQ6IFNuYXBHcmlkID0ge307XG5cbiAgLyoqXG4gICAqIFNob3cgYSBnaG9zdCBlbGVtZW50IHRoYXQgc2hvd3MgdGhlIGRyYWcgd2hlbiBkcmFnZ2luZ1xuICAgKi9cbiAgQElucHV0KCkgZ2hvc3REcmFnRW5hYmxlZDogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqXG4gICAqIFNob3cgdGhlIG9yaWdpbmFsIGVsZW1lbnQgd2hlbiBnaG9zdERyYWdFbmFibGVkIGlzIHRydWVcbiAgICovXG4gIEBJbnB1dCgpIHNob3dPcmlnaW5hbEVsZW1lbnRXaGlsZURyYWdnaW5nOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEFsbG93IGN1c3RvbSBiZWhhdmlvdXIgdG8gY29udHJvbCB3aGVuIHRoZSBlbGVtZW50IGlzIGRyYWdnZWRcbiAgICovXG4gIEBJbnB1dCgpIHZhbGlkYXRlRHJhZzogVmFsaWRhdGVEcmFnO1xuXG4gIC8qKlxuICAgKiBUaGUgY3Vyc29yIHRvIHVzZSB3aGVuIGhvdmVyaW5nIG92ZXIgYSBkcmFnZ2FibGUgZWxlbWVudFxuICAgKi9cbiAgQElucHV0KCkgZHJhZ0N1cnNvcjogc3RyaW5nID0gJyc7XG5cbiAgLyoqXG4gICAqIFRoZSBjc3MgY2xhc3MgdG8gYXBwbHkgd2hlbiB0aGUgZWxlbWVudCBpcyBiZWluZyBkcmFnZ2VkXG4gICAqL1xuICBASW5wdXQoKSBkcmFnQWN0aXZlQ2xhc3M6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGVsZW1lbnQgdGhlIGdob3N0IGVsZW1lbnQgd2lsbCBiZSBhcHBlbmRlZCB0by4gRGVmYXVsdCBpcyBuZXh0IHRvIHRoZSBkcmFnZ2VkIGVsZW1lbnRcbiAgICovXG4gIEBJbnB1dCgpIGdob3N0RWxlbWVudEFwcGVuZFRvOiBIVE1MRWxlbWVudDtcblxuICAvKipcbiAgICogQW4gbmctdGVtcGxhdGUgdG8gYmUgaW5zZXJ0ZWQgaW50byB0aGUgcGFyZW50IGVsZW1lbnQgb2YgdGhlIGdob3N0IGVsZW1lbnQuIEl0IHdpbGwgb3ZlcndyaXRlIGFueSBjaGlsZCBub2Rlcy5cbiAgICovXG4gIEBJbnB1dCgpIGdob3N0RWxlbWVudFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIC8qKlxuICAgKiBBbW91bnQgb2YgbWlsbGlzZWNvbmRzIHRvIHdhaXQgb24gdG91Y2ggZGV2aWNlcyBiZWZvcmUgc3RhcnRpbmcgdG8gZHJhZyB0aGUgZWxlbWVudCAoc28gdGhhdCB5b3UgY2FuIHNjcm9sbCB0aGUgcGFnZSBieSB0b3VjaGluZyBhIGRyYWdnYWJsZSBlbGVtZW50KVxuICAgKi9cbiAgQElucHV0KCkgdG91Y2hTdGFydExvbmdQcmVzczogeyBkZWxheTogbnVtYmVyOyBkZWx0YTogbnVtYmVyIH07XG5cbiAgLypcbiAgICogT3B0aW9ucyB1c2VkIHRvIGNvbnRyb2wgdGhlIGJlaGF2aW91ciBvZiBhdXRvIHNjcm9sbGluZzogaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2UvZG9tLWF1dG9zY3JvbGxlclxuICAgKi9cbiAgQElucHV0KCkgYXV0b1Njcm9sbDoge1xuICAgIG1hcmdpbjpcbiAgICAgIHwgbnVtYmVyXG4gICAgICB8IHsgdG9wPzogbnVtYmVyOyBsZWZ0PzogbnVtYmVyOyByaWdodD86IG51bWJlcjsgYm90dG9tPzogbnVtYmVyIH07XG4gICAgbWF4U3BlZWQ/OlxuICAgICAgfCBudW1iZXJcbiAgICAgIHwgeyB0b3A/OiBudW1iZXI7IGxlZnQ/OiBudW1iZXI7IHJpZ2h0PzogbnVtYmVyOyBib3R0b20/OiBudW1iZXIgfTtcbiAgICBzY3JvbGxXaGVuT3V0c2lkZT86IGJvb2xlYW47XG4gIH0gPSB7XG4gICAgbWFyZ2luOiAyMCxcbiAgfTtcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGVsZW1lbnQgY2FuIGJlIGRyYWdnZWQgYWxvbmcgb25lIGF4aXMgYW5kIGhhcyB0aGUgbW91c2Ugb3IgcG9pbnRlciBkZXZpY2UgcHJlc3NlZCBvbiBpdFxuICAgKi9cbiAgQE91dHB1dCgpIGRyYWdQb2ludGVyRG93biA9IG5ldyBFdmVudEVtaXR0ZXI8RHJhZ1BvaW50ZXJEb3duRXZlbnQ+KCk7XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBlbGVtZW50IGhhcyBzdGFydGVkIHRvIGJlIGRyYWdnZWQuXG4gICAqIE9ubHkgY2FsbGVkIGFmdGVyIGF0IGxlYXN0IG9uZSBtb3VzZSBvciB0b3VjaCBtb3ZlIGV2ZW50LlxuICAgKiBJZiB5b3UgY2FsbCAkZXZlbnQuY2FuY2VsRHJhZyQuZW1pdCgpIGl0IHdpbGwgY2FuY2VsIHRoZSBjdXJyZW50IGRyYWdcbiAgICovXG4gIEBPdXRwdXQoKSBkcmFnU3RhcnQgPSBuZXcgRXZlbnRFbWl0dGVyPERyYWdTdGFydEV2ZW50PigpO1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgYWZ0ZXIgdGhlIGdob3N0IGVsZW1lbnQgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgQE91dHB1dCgpIGdob3N0RWxlbWVudENyZWF0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPEdob3N0RWxlbWVudENyZWF0ZWRFdmVudD4oKTtcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGVsZW1lbnQgaXMgYmVpbmcgZHJhZ2dlZFxuICAgKi9cbiAgQE91dHB1dCgpIGRyYWdnaW5nID0gbmV3IEV2ZW50RW1pdHRlcjxEcmFnTW92ZUV2ZW50PigpO1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgYWZ0ZXIgdGhlIGVsZW1lbnQgaXMgZHJhZ2dlZFxuICAgKi9cbiAgQE91dHB1dCgpIGRyYWdFbmQgPSBuZXcgRXZlbnRFbWl0dGVyPERyYWdFbmRFdmVudD4oKTtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgcG9pbnRlckRvd24kID0gbmV3IFN1YmplY3Q8UG9pbnRlckV2ZW50PigpO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBwb2ludGVyTW92ZSQgPSBuZXcgU3ViamVjdDxQb2ludGVyRXZlbnQ+KCk7XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIHBvaW50ZXJVcCQgPSBuZXcgU3ViamVjdDxQb2ludGVyRXZlbnQ+KCk7XG5cbiAgcHJpdmF0ZSBldmVudExpc3RlbmVyU3Vic2NyaXB0aW9uczoge1xuICAgIG1vdXNlbW92ZT86ICgpID0+IHZvaWQ7XG4gICAgbW91c2Vkb3duPzogKCkgPT4gdm9pZDtcbiAgICBtb3VzZXVwPzogKCkgPT4gdm9pZDtcbiAgICBtb3VzZWVudGVyPzogKCkgPT4gdm9pZDtcbiAgICBtb3VzZWxlYXZlPzogKCkgPT4gdm9pZDtcbiAgICB0b3VjaHN0YXJ0PzogKCkgPT4gdm9pZDtcbiAgICB0b3VjaG1vdmU/OiAoKSA9PiB2b2lkO1xuICAgIHRvdWNoZW5kPzogKCkgPT4gdm9pZDtcbiAgICB0b3VjaGNhbmNlbD86ICgpID0+IHZvaWQ7XG4gIH0gPSB7fTtcblxuICBwcml2YXRlIGdob3N0RWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsO1xuXG4gIHByaXZhdGUgZGVzdHJveSQgPSBuZXcgU3ViamVjdCgpO1xuXG4gIHByaXZhdGUgdGltZUxvbmdQcmVzczogVGltZUxvbmdQcmVzcyA9IHsgdGltZXJCZWdpbjogMCwgdGltZXJFbmQ6IDAgfTtcblxuICBwcml2YXRlIHNjcm9sbGVyOiB7IGRlc3Ryb3k6ICgpID0+IHZvaWQgfTtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHJpdmF0ZSBkcmFnZ2FibGVIZWxwZXI6IERyYWdnYWJsZUhlbHBlcixcbiAgICBwcml2YXRlIHpvbmU6IE5nWm9uZSxcbiAgICBwcml2YXRlIHZjcjogVmlld0NvbnRhaW5lclJlZixcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIHNjcm9sbENvbnRhaW5lcjogRHJhZ2dhYmxlU2Nyb2xsQ29udGFpbmVyRGlyZWN0aXZlLFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQ6IGFueVxuICApIHt9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5jaGVja0V2ZW50TGlzdGVuZXJzKCk7XG5cbiAgICBjb25zdCBwb2ludGVyRHJhZ2dlZCQ6IE9ic2VydmFibGU8YW55PiA9IHRoaXMucG9pbnRlckRvd24kLnBpcGUoXG4gICAgICBmaWx0ZXIoKCkgPT4gdGhpcy5jYW5EcmFnKCkpLFxuICAgICAgbWVyZ2VNYXAoKHBvaW50ZXJEb3duRXZlbnQ6IFBvaW50ZXJFdmVudCkgPT4ge1xuICAgICAgICAvLyBmaXggZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXR0bGV3aXM5Mi9hbmd1bGFyLWRyYWdnYWJsZS1kcm9wcGFibGUvaXNzdWVzLzYxXG4gICAgICAgIC8vIHN0b3AgbW91c2UgZXZlbnRzIHByb3BhZ2F0aW5nIHVwIHRoZSBjaGFpblxuICAgICAgICBpZiAocG9pbnRlckRvd25FdmVudC5ldmVudC5zdG9wUHJvcGFnYXRpb24gJiYgIXRoaXMuc2Nyb2xsQ29udGFpbmVyKSB7XG4gICAgICAgICAgcG9pbnRlckRvd25FdmVudC5ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGhhY2sgdG8gcHJldmVudCB0ZXh0IGdldHRpbmcgc2VsZWN0ZWQgaW4gc2FmYXJpIHdoaWxlIGRyYWdnaW5nXG4gICAgICAgIGNvbnN0IGdsb2JhbERyYWdTdHlsZTogSFRNTFN0eWxlRWxlbWVudCA9IHRoaXMucmVuZGVyZXIuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnc3R5bGUnXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKGdsb2JhbERyYWdTdHlsZSwgJ3R5cGUnLCAndGV4dC9jc3MnKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5hcHBlbmRDaGlsZChcbiAgICAgICAgICBnbG9iYWxEcmFnU3R5bGUsXG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5jcmVhdGVUZXh0KGBcbiAgICAgICAgICBib2R5ICoge1xuICAgICAgICAgICAtbW96LXVzZXItc2VsZWN0OiBub25lO1xuICAgICAgICAgICAtbXMtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgICAgICAgIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgICAgICAgIHVzZXItc2VsZWN0OiBub25lO1xuICAgICAgICAgIH1cbiAgICAgICAgYClcbiAgICAgICAgKTtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICB0aGlzLmRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoZ2xvYmFsRHJhZ1N0eWxlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3Qgc3RhcnRTY3JvbGxQb3NpdGlvbiA9IHRoaXMuZ2V0U2Nyb2xsUG9zaXRpb24oKTtcblxuICAgICAgICBjb25zdCBzY3JvbGxDb250YWluZXJTY3JvbGwkID0gbmV3IE9ic2VydmFibGUoKG9ic2VydmVyKSA9PiB7XG4gICAgICAgICAgY29uc3Qgc2Nyb2xsQ29udGFpbmVyID0gdGhpcy5zY3JvbGxDb250YWluZXJcbiAgICAgICAgICAgID8gdGhpcy5zY3JvbGxDb250YWluZXIuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50XG4gICAgICAgICAgICA6ICd3aW5kb3cnO1xuICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlcmVyLmxpc3RlbihzY3JvbGxDb250YWluZXIsICdzY3JvbGwnLCAoZSkgPT5cbiAgICAgICAgICAgIG9ic2VydmVyLm5leHQoZSlcbiAgICAgICAgICApO1xuICAgICAgICB9KS5waXBlKFxuICAgICAgICAgIHN0YXJ0V2l0aChzdGFydFNjcm9sbFBvc2l0aW9uKSxcbiAgICAgICAgICBtYXAoKCkgPT4gdGhpcy5nZXRTY3JvbGxQb3NpdGlvbigpKVxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IGN1cnJlbnREcmFnJCA9IG5ldyBTdWJqZWN0PEN1cnJlbnREcmFnRGF0YT4oKTtcbiAgICAgICAgY29uc3QgY2FuY2VsRHJhZyQgPSBuZXcgUmVwbGF5U3ViamVjdDx2b2lkPigpO1xuXG4gICAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMuZHJhZ1BvaW50ZXJEb3duLm5leHQoeyB4OiAwLCB5OiAwIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBkcmFnQ29tcGxldGUkID0gbWVyZ2UoXG4gICAgICAgICAgdGhpcy5wb2ludGVyVXAkLFxuICAgICAgICAgIHRoaXMucG9pbnRlckRvd24kLFxuICAgICAgICAgIGNhbmNlbERyYWckLFxuICAgICAgICAgIHRoaXMuZGVzdHJveSRcbiAgICAgICAgKS5waXBlKHNoYXJlKCkpO1xuXG4gICAgICAgIGNvbnN0IHBvaW50ZXJNb3ZlID0gY29tYmluZUxhdGVzdChbXG4gICAgICAgICAgdGhpcy5wb2ludGVyTW92ZSQsXG4gICAgICAgICAgc2Nyb2xsQ29udGFpbmVyU2Nyb2xsJCxcbiAgICAgICAgXSkucGlwZShcbiAgICAgICAgICBtYXAoKFtwb2ludGVyTW92ZUV2ZW50LCBzY3JvbGxdKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBjdXJyZW50RHJhZyQsXG4gICAgICAgICAgICAgIHRyYW5zZm9ybVg6IHBvaW50ZXJNb3ZlRXZlbnQuY2xpZW50WCAtIHBvaW50ZXJEb3duRXZlbnQuY2xpZW50WCxcbiAgICAgICAgICAgICAgdHJhbnNmb3JtWTogcG9pbnRlck1vdmVFdmVudC5jbGllbnRZIC0gcG9pbnRlckRvd25FdmVudC5jbGllbnRZLFxuICAgICAgICAgICAgICBjbGllbnRYOiBwb2ludGVyTW92ZUV2ZW50LmNsaWVudFgsXG4gICAgICAgICAgICAgIGNsaWVudFk6IHBvaW50ZXJNb3ZlRXZlbnQuY2xpZW50WSxcbiAgICAgICAgICAgICAgc2Nyb2xsTGVmdDogc2Nyb2xsLmxlZnQsXG4gICAgICAgICAgICAgIHNjcm9sbFRvcDogc2Nyb2xsLnRvcCxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSksXG4gICAgICAgICAgbWFwKChtb3ZlRGF0YSkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuZHJhZ1NuYXBHcmlkLngpIHtcbiAgICAgICAgICAgICAgbW92ZURhdGEudHJhbnNmb3JtWCA9XG4gICAgICAgICAgICAgICAgTWF0aC5yb3VuZChtb3ZlRGF0YS50cmFuc2Zvcm1YIC8gdGhpcy5kcmFnU25hcEdyaWQueCkgKlxuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ1NuYXBHcmlkLng7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmRyYWdTbmFwR3JpZC55KSB7XG4gICAgICAgICAgICAgIG1vdmVEYXRhLnRyYW5zZm9ybVkgPVxuICAgICAgICAgICAgICAgIE1hdGgucm91bmQobW92ZURhdGEudHJhbnNmb3JtWSAvIHRoaXMuZHJhZ1NuYXBHcmlkLnkpICpcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdTbmFwR3JpZC55O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbW92ZURhdGE7XG4gICAgICAgICAgfSksXG4gICAgICAgICAgbWFwKChtb3ZlRGF0YSkgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmRyYWdBeGlzLngpIHtcbiAgICAgICAgICAgICAgbW92ZURhdGEudHJhbnNmb3JtWCA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5kcmFnQXhpcy55KSB7XG4gICAgICAgICAgICAgIG1vdmVEYXRhLnRyYW5zZm9ybVkgPSAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbW92ZURhdGE7XG4gICAgICAgICAgfSksXG4gICAgICAgICAgbWFwKChtb3ZlRGF0YSkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc2Nyb2xsWCA9IG1vdmVEYXRhLnNjcm9sbExlZnQgLSBzdGFydFNjcm9sbFBvc2l0aW9uLmxlZnQ7XG4gICAgICAgICAgICBjb25zdCBzY3JvbGxZID0gbW92ZURhdGEuc2Nyb2xsVG9wIC0gc3RhcnRTY3JvbGxQb3NpdGlvbi50b3A7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAuLi5tb3ZlRGF0YSxcbiAgICAgICAgICAgICAgeDogbW92ZURhdGEudHJhbnNmb3JtWCArIHNjcm9sbFgsXG4gICAgICAgICAgICAgIHk6IG1vdmVEYXRhLnRyYW5zZm9ybVkgKyBzY3JvbGxZLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBmaWx0ZXIoXG4gICAgICAgICAgICAoeyB4LCB5LCB0cmFuc2Zvcm1YLCB0cmFuc2Zvcm1ZIH0pID0+XG4gICAgICAgICAgICAgICF0aGlzLnZhbGlkYXRlRHJhZyB8fFxuICAgICAgICAgICAgICB0aGlzLnZhbGlkYXRlRHJhZyh7XG4gICAgICAgICAgICAgICAgeCxcbiAgICAgICAgICAgICAgICB5LFxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogeyB4OiB0cmFuc2Zvcm1YLCB5OiB0cmFuc2Zvcm1ZIH0sXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgKSxcbiAgICAgICAgICB0YWtlVW50aWwoZHJhZ0NvbXBsZXRlJCksXG4gICAgICAgICAgc2hhcmUoKVxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IGRyYWdTdGFydGVkJCA9IHBvaW50ZXJNb3ZlLnBpcGUodGFrZSgxKSwgc2hhcmUoKSk7XG4gICAgICAgIGNvbnN0IGRyYWdFbmRlZCQgPSBwb2ludGVyTW92ZS5waXBlKHRha2VMYXN0KDEpLCBzaGFyZSgpKTtcblxuICAgICAgICBkcmFnU3RhcnRlZCQuc3Vic2NyaWJlKCh7IGNsaWVudFgsIGNsaWVudFksIHgsIHkgfSkgPT4ge1xuICAgICAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5kcmFnU3RhcnQubmV4dCh7IGNhbmNlbERyYWckIH0pO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdGhpcy5zY3JvbGxlciA9IGF1dG9TY3JvbGwoXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIHRoaXMuc2Nyb2xsQ29udGFpbmVyXG4gICAgICAgICAgICAgICAgPyB0aGlzLnNjcm9sbENvbnRhaW5lci5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnRcbiAgICAgICAgICAgICAgICA6IHRoaXMuZG9jdW1lbnQuZGVmYXVsdFZpZXcsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAuLi50aGlzLmF1dG9TY3JvbGwsXG4gICAgICAgICAgICAgIGF1dG9TY3JvbGwoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9XG4gICAgICAgICAgKTtcbiAgICAgICAgICBhZGRDbGFzcyh0aGlzLnJlbmRlcmVyLCB0aGlzLmVsZW1lbnQsIHRoaXMuZHJhZ0FjdGl2ZUNsYXNzKTtcblxuICAgICAgICAgIGlmICh0aGlzLmdob3N0RHJhZ0VuYWJsZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlY3QgPSB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIGNvbnN0IGNsb25lID0gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2xvbmVOb2RlKFxuICAgICAgICAgICAgICB0cnVlXG4gICAgICAgICAgICApIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAgICAgaWYgKCF0aGlzLnNob3dPcmlnaW5hbEVsZW1lbnRXaGlsZURyYWdnaW5nKSB7XG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgICAgICAgJ3Zpc2liaWxpdHknLFxuICAgICAgICAgICAgICAgICdoaWRkZW4nXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmdob3N0RWxlbWVudEFwcGVuZFRvKSB7XG4gICAgICAgICAgICAgIHRoaXMuZ2hvc3RFbGVtZW50QXBwZW5kVG8uYXBwZW5kQ2hpbGQoY2xvbmUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQucGFyZW50Tm9kZSEuaW5zZXJ0QmVmb3JlKFxuICAgICAgICAgICAgICAgIGNsb25lLFxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50Lm5leHRTaWJsaW5nXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZ2hvc3RFbGVtZW50ID0gY2xvbmU7XG5cbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnQuYm9keS5zdHlsZS5jdXJzb3IgPSB0aGlzLmRyYWdDdXJzb3I7XG5cbiAgICAgICAgICAgIHRoaXMuc2V0RWxlbWVudFN0eWxlcyhjbG9uZSwge1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgICAgICAgICAgdG9wOiBgJHtyZWN0LnRvcH1weGAsXG4gICAgICAgICAgICAgIGxlZnQ6IGAke3JlY3QubGVmdH1weGAsXG4gICAgICAgICAgICAgIHdpZHRoOiBgJHtyZWN0LndpZHRofXB4YCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiBgJHtyZWN0LmhlaWdodH1weGAsXG4gICAgICAgICAgICAgIGN1cnNvcjogdGhpcy5kcmFnQ3Vyc29yLFxuICAgICAgICAgICAgICBtYXJnaW46ICcwJyxcbiAgICAgICAgICAgICAgd2lsbENoYW5nZTogJ3RyYW5zZm9ybScsXG4gICAgICAgICAgICAgIHBvaW50ZXJFdmVudHM6ICdub25lJyxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5naG9zdEVsZW1lbnRUZW1wbGF0ZSkge1xuICAgICAgICAgICAgICBjb25zdCB2aWV3UmVmID0gdGhpcy52Y3IuY3JlYXRlRW1iZWRkZWRWaWV3KFxuICAgICAgICAgICAgICAgIHRoaXMuZ2hvc3RFbGVtZW50VGVtcGxhdGVcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgY2xvbmUuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICAgIHZpZXdSZWYucm9vdE5vZGVzXG4gICAgICAgICAgICAgICAgLmZpbHRlcigobm9kZSkgPT4gbm9kZSBpbnN0YW5jZW9mIE5vZGUpXG4gICAgICAgICAgICAgICAgLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgICAgICAgICAgICAgIGNsb25lLmFwcGVuZENoaWxkKG5vZGUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBkcmFnRW5kZWQkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy52Y3IucmVtb3ZlKHRoaXMudmNyLmluZGV4T2Yodmlld1JlZikpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuZ2hvc3RFbGVtZW50Q3JlYXRlZC5lbWl0KHtcbiAgICAgICAgICAgICAgICBjbGllbnRYOiBjbGllbnRYIC0geCxcbiAgICAgICAgICAgICAgICBjbGllbnRZOiBjbGllbnRZIC0geSxcbiAgICAgICAgICAgICAgICBlbGVtZW50OiBjbG9uZSxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZHJhZ0VuZGVkJC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICBjbG9uZS5wYXJlbnRFbGVtZW50IS5yZW1vdmVDaGlsZChjbG9uZSk7XG4gICAgICAgICAgICAgIHRoaXMuZ2hvc3RFbGVtZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCxcbiAgICAgICAgICAgICAgICAndmlzaWJpbGl0eScsXG4gICAgICAgICAgICAgICAgJydcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuZHJhZ2dhYmxlSGVscGVyLmN1cnJlbnREcmFnLm5leHQoY3VycmVudERyYWckKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZHJhZ0VuZGVkJFxuICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgbWVyZ2VNYXAoKGRyYWdFbmREYXRhKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGRyYWdFbmREYXRhJCA9IGNhbmNlbERyYWckLnBpcGUoXG4gICAgICAgICAgICAgICAgY291bnQoKSxcbiAgICAgICAgICAgICAgICB0YWtlKDEpLFxuICAgICAgICAgICAgICAgIG1hcCgoY2FsbGVkQ291bnQpID0+ICh7XG4gICAgICAgICAgICAgICAgICAuLi5kcmFnRW5kRGF0YSxcbiAgICAgICAgICAgICAgICAgIGRyYWdDYW5jZWxsZWQ6IGNhbGxlZENvdW50ID4gMCxcbiAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgY2FuY2VsRHJhZyQuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgcmV0dXJuIGRyYWdFbmREYXRhJDtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgKVxuICAgICAgICAgIC5zdWJzY3JpYmUoKHsgeCwgeSwgZHJhZ0NhbmNlbGxlZCB9KSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbGVyLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmRyYWdFbmQubmV4dCh7IHgsIHksIGRyYWdDYW5jZWxsZWQgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJlbW92ZUNsYXNzKHRoaXMucmVuZGVyZXIsIHRoaXMuZWxlbWVudCwgdGhpcy5kcmFnQWN0aXZlQ2xhc3MpO1xuICAgICAgICAgICAgY3VycmVudERyYWckLmNvbXBsZXRlKCk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgbWVyZ2UoZHJhZ0NvbXBsZXRlJCwgZHJhZ0VuZGVkJClcbiAgICAgICAgICAucGlwZSh0YWtlKDEpKVxuICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5kb2N1bWVudC5oZWFkLnJlbW92ZUNoaWxkKGdsb2JhbERyYWdTdHlsZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcG9pbnRlck1vdmU7XG4gICAgICB9KSxcbiAgICAgIHNoYXJlKClcbiAgICApO1xuXG4gICAgbWVyZ2UoXG4gICAgICBwb2ludGVyRHJhZ2dlZCQucGlwZShcbiAgICAgICAgdGFrZSgxKSxcbiAgICAgICAgbWFwKCh2YWx1ZSkgPT4gWywgdmFsdWVdKVxuICAgICAgKSxcbiAgICAgIHBvaW50ZXJEcmFnZ2VkJC5waXBlKHBhaXJ3aXNlKCkpXG4gICAgKVxuICAgICAgLnBpcGUoXG4gICAgICAgIGZpbHRlcigoW3ByZXZpb3VzLCBuZXh0XSkgPT4ge1xuICAgICAgICAgIGlmICghcHJldmlvdXMpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcHJldmlvdXMueCAhPT0gbmV4dC54IHx8IHByZXZpb3VzLnkgIT09IG5leHQueTtcbiAgICAgICAgfSksXG4gICAgICAgIG1hcCgoW3ByZXZpb3VzLCBuZXh0XSkgPT4gbmV4dClcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoXG4gICAgICAgICh7IHgsIHksIGN1cnJlbnREcmFnJCwgY2xpZW50WCwgY2xpZW50WSwgdHJhbnNmb3JtWCwgdHJhbnNmb3JtWSB9KSA9PiB7XG4gICAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRyYWdnaW5nLm5leHQoeyB4LCB5IH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5naG9zdEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtID0gYHRyYW5zbGF0ZTNkKCR7dHJhbnNmb3JtWH1weCwgJHt0cmFuc2Zvcm1ZfXB4LCAwcHgpYDtcbiAgICAgICAgICAgICAgdGhpcy5zZXRFbGVtZW50U3R5bGVzKHRoaXMuZ2hvc3RFbGVtZW50LCB7XG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtLFxuICAgICAgICAgICAgICAgICctd2Via2l0LXRyYW5zZm9ybSc6IHRyYW5zZm9ybSxcbiAgICAgICAgICAgICAgICAnLW1zLXRyYW5zZm9ybSc6IHRyYW5zZm9ybSxcbiAgICAgICAgICAgICAgICAnLW1vei10cmFuc2Zvcm0nOiB0cmFuc2Zvcm0sXG4gICAgICAgICAgICAgICAgJy1vLXRyYW5zZm9ybSc6IHRyYW5zZm9ybSxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY3VycmVudERyYWckLm5leHQoe1xuICAgICAgICAgICAgY2xpZW50WCxcbiAgICAgICAgICAgIGNsaWVudFksXG4gICAgICAgICAgICBkcm9wRGF0YTogdGhpcy5kcm9wRGF0YSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoY2hhbmdlcy5kcmFnQXhpcykge1xuICAgICAgdGhpcy5jaGVja0V2ZW50TGlzdGVuZXJzKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy51bnN1YnNjcmliZUV2ZW50TGlzdGVuZXJzKCk7XG4gICAgdGhpcy5wb2ludGVyRG93biQuY29tcGxldGUoKTtcbiAgICB0aGlzLnBvaW50ZXJNb3ZlJC5jb21wbGV0ZSgpO1xuICAgIHRoaXMucG9pbnRlclVwJC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuZGVzdHJveSQubmV4dCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBjaGVja0V2ZW50TGlzdGVuZXJzKCk6IHZvaWQge1xuICAgIGNvbnN0IGNhbkRyYWc6IGJvb2xlYW4gPSB0aGlzLmNhbkRyYWcoKTtcbiAgICBjb25zdCBoYXNFdmVudExpc3RlbmVyczogYm9vbGVhbiA9XG4gICAgICBPYmplY3Qua2V5cyh0aGlzLmV2ZW50TGlzdGVuZXJTdWJzY3JpcHRpb25zKS5sZW5ndGggPiAwO1xuXG4gICAgaWYgKGNhbkRyYWcgJiYgIWhhc0V2ZW50TGlzdGVuZXJzKSB7XG4gICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICB0aGlzLmV2ZW50TGlzdGVuZXJTdWJzY3JpcHRpb25zLm1vdXNlZG93biA9IHRoaXMucmVuZGVyZXIubGlzdGVuKFxuICAgICAgICAgIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LFxuICAgICAgICAgICdtb3VzZWRvd24nLFxuICAgICAgICAgIChldmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5vbk1vdXNlRG93bihldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMubW91c2V1cCA9IHRoaXMucmVuZGVyZXIubGlzdGVuKFxuICAgICAgICAgICdkb2N1bWVudCcsXG4gICAgICAgICAgJ21vdXNldXAnLFxuICAgICAgICAgIChldmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5vbk1vdXNlVXAoZXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLmV2ZW50TGlzdGVuZXJTdWJzY3JpcHRpb25zLnRvdWNoc3RhcnQgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbihcbiAgICAgICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCxcbiAgICAgICAgICAndG91Y2hzdGFydCcsXG4gICAgICAgICAgKGV2ZW50OiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uVG91Y2hTdGFydChldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMudG91Y2hlbmQgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbihcbiAgICAgICAgICAnZG9jdW1lbnQnLFxuICAgICAgICAgICd0b3VjaGVuZCcsXG4gICAgICAgICAgKGV2ZW50OiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uVG91Y2hFbmQoZXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLmV2ZW50TGlzdGVuZXJTdWJzY3JpcHRpb25zLnRvdWNoY2FuY2VsID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oXG4gICAgICAgICAgJ2RvY3VtZW50JyxcbiAgICAgICAgICAndG91Y2hjYW5jZWwnLFxuICAgICAgICAgIChldmVudDogVG91Y2hFdmVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5vblRvdWNoRW5kKGV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5ldmVudExpc3RlbmVyU3Vic2NyaXB0aW9ucy5tb3VzZWVudGVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oXG4gICAgICAgICAgdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgJ21vdXNlZW50ZXInLFxuICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMub25Nb3VzZUVudGVyKCk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMubW91c2VsZWF2ZSA9IHRoaXMucmVuZGVyZXIubGlzdGVuKFxuICAgICAgICAgIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LFxuICAgICAgICAgICdtb3VzZWxlYXZlJyxcbiAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uTW91c2VMZWF2ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoIWNhbkRyYWcgJiYgaGFzRXZlbnRMaXN0ZW5lcnMpIHtcbiAgICAgIHRoaXMudW5zdWJzY3JpYmVFdmVudExpc3RlbmVycygpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgb25Nb3VzZURvd24oZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoZXZlbnQuYnV0dG9uID09PSAwKSB7XG4gICAgICBpZiAoIXRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMubW91c2Vtb3ZlKSB7XG4gICAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMubW91c2Vtb3ZlID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oXG4gICAgICAgICAgJ2RvY3VtZW50JyxcbiAgICAgICAgICAnbW91c2Vtb3ZlJyxcbiAgICAgICAgICAobW91c2VNb3ZlRXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMucG9pbnRlck1vdmUkLm5leHQoe1xuICAgICAgICAgICAgICBldmVudDogbW91c2VNb3ZlRXZlbnQsXG4gICAgICAgICAgICAgIGNsaWVudFg6IG1vdXNlTW92ZUV2ZW50LmNsaWVudFgsXG4gICAgICAgICAgICAgIGNsaWVudFk6IG1vdXNlTW92ZUV2ZW50LmNsaWVudFksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICB0aGlzLnBvaW50ZXJEb3duJC5uZXh0KHtcbiAgICAgICAgZXZlbnQsXG4gICAgICAgIGNsaWVudFg6IGV2ZW50LmNsaWVudFgsXG4gICAgICAgIGNsaWVudFk6IGV2ZW50LmNsaWVudFksXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG9uTW91c2VVcChldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGlmIChldmVudC5idXR0b24gPT09IDApIHtcbiAgICAgIGlmICh0aGlzLmV2ZW50TGlzdGVuZXJTdWJzY3JpcHRpb25zLm1vdXNlbW92ZSkge1xuICAgICAgICB0aGlzLmV2ZW50TGlzdGVuZXJTdWJzY3JpcHRpb25zLm1vdXNlbW92ZSgpO1xuICAgICAgICBkZWxldGUgdGhpcy5ldmVudExpc3RlbmVyU3Vic2NyaXB0aW9ucy5tb3VzZW1vdmU7XG4gICAgICB9XG4gICAgICB0aGlzLnBvaW50ZXJVcCQubmV4dCh7XG4gICAgICAgIGV2ZW50LFxuICAgICAgICBjbGllbnRYOiBldmVudC5jbGllbnRYLFxuICAgICAgICBjbGllbnRZOiBldmVudC5jbGllbnRZLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBvblRvdWNoU3RhcnQoZXZlbnQ6IFRvdWNoRXZlbnQpOiB2b2lkIHtcbiAgICBsZXQgc3RhcnRTY3JvbGxQb3NpdGlvbjogYW55O1xuICAgIGxldCBpc0RyYWdBY3RpdmF0ZWQ6IGJvb2xlYW47XG4gICAgbGV0IGhhc0NvbnRhaW5lclNjcm9sbGJhcjogYm9vbGVhbjtcbiAgICBpZiAoXG4gICAgICAodGhpcy5zY3JvbGxDb250YWluZXIgJiYgdGhpcy5zY3JvbGxDb250YWluZXIuYWN0aXZlTG9uZ1ByZXNzRHJhZykgfHxcbiAgICAgIHRoaXMudG91Y2hTdGFydExvbmdQcmVzc1xuICAgICkge1xuICAgICAgdGhpcy50aW1lTG9uZ1ByZXNzLnRpbWVyQmVnaW4gPSBEYXRlLm5vdygpO1xuICAgICAgaXNEcmFnQWN0aXZhdGVkID0gZmFsc2U7XG4gICAgICBoYXNDb250YWluZXJTY3JvbGxiYXIgPSB0aGlzLmhhc1Njcm9sbGJhcigpO1xuICAgICAgc3RhcnRTY3JvbGxQb3NpdGlvbiA9IHRoaXMuZ2V0U2Nyb2xsUG9zaXRpb24oKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMudG91Y2htb3ZlKSB7XG4gICAgICBjb25zdCBjb250ZXh0TWVudUxpc3RlbmVyID0gZnJvbUV2ZW50PEV2ZW50PihcbiAgICAgICAgdGhpcy5kb2N1bWVudCxcbiAgICAgICAgJ2NvbnRleHRtZW51J1xuICAgICAgKS5zdWJzY3JpYmUoKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHRvdWNoTW92ZUxpc3RlbmVyID0gZnJvbUV2ZW50PFRvdWNoRXZlbnQ+KFxuICAgICAgICB0aGlzLmRvY3VtZW50LFxuICAgICAgICAndG91Y2htb3ZlJyxcbiAgICAgICAge1xuICAgICAgICAgIHBhc3NpdmU6IGZhbHNlLFxuICAgICAgICB9XG4gICAgICApLnN1YnNjcmliZSgodG91Y2hNb3ZlRXZlbnQpID0+IHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICgodGhpcy5zY3JvbGxDb250YWluZXIgJiYgdGhpcy5zY3JvbGxDb250YWluZXIuYWN0aXZlTG9uZ1ByZXNzRHJhZykgfHxcbiAgICAgICAgICAgIHRoaXMudG91Y2hTdGFydExvbmdQcmVzcykgJiZcbiAgICAgICAgICAhaXNEcmFnQWN0aXZhdGVkICYmXG4gICAgICAgICAgaGFzQ29udGFpbmVyU2Nyb2xsYmFyXG4gICAgICAgICkge1xuICAgICAgICAgIGlzRHJhZ0FjdGl2YXRlZCA9IHRoaXMuc2hvdWxkQmVnaW5EcmFnKFxuICAgICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgICB0b3VjaE1vdmVFdmVudCxcbiAgICAgICAgICAgIHN0YXJ0U2Nyb2xsUG9zaXRpb25cbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChcbiAgICAgICAgICAoKCF0aGlzLnNjcm9sbENvbnRhaW5lciB8fFxuICAgICAgICAgICAgIXRoaXMuc2Nyb2xsQ29udGFpbmVyLmFjdGl2ZUxvbmdQcmVzc0RyYWcpICYmXG4gICAgICAgICAgICAhdGhpcy50b3VjaFN0YXJ0TG9uZ1ByZXNzKSB8fFxuICAgICAgICAgICFoYXNDb250YWluZXJTY3JvbGxiYXIgfHxcbiAgICAgICAgICBpc0RyYWdBY3RpdmF0ZWRcbiAgICAgICAgKSB7XG4gICAgICAgICAgdG91Y2hNb3ZlRXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB0aGlzLnBvaW50ZXJNb3ZlJC5uZXh0KHtcbiAgICAgICAgICAgIGV2ZW50OiB0b3VjaE1vdmVFdmVudCxcbiAgICAgICAgICAgIGNsaWVudFg6IHRvdWNoTW92ZUV2ZW50LnRhcmdldFRvdWNoZXNbMF0uY2xpZW50WCxcbiAgICAgICAgICAgIGNsaWVudFk6IHRvdWNoTW92ZUV2ZW50LnRhcmdldFRvdWNoZXNbMF0uY2xpZW50WSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMudG91Y2htb3ZlID0gKCkgPT4ge1xuICAgICAgICBjb250ZXh0TWVudUxpc3RlbmVyLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIHRvdWNoTW92ZUxpc3RlbmVyLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9O1xuICAgIH1cbiAgICB0aGlzLnBvaW50ZXJEb3duJC5uZXh0KHtcbiAgICAgIGV2ZW50LFxuICAgICAgY2xpZW50WDogZXZlbnQudG91Y2hlc1swXS5jbGllbnRYLFxuICAgICAgY2xpZW50WTogZXZlbnQudG91Y2hlc1swXS5jbGllbnRZLFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBvblRvdWNoRW5kKGV2ZW50OiBUb3VjaEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMudG91Y2htb3ZlKSB7XG4gICAgICB0aGlzLmV2ZW50TGlzdGVuZXJTdWJzY3JpcHRpb25zLnRvdWNobW92ZSgpO1xuICAgICAgZGVsZXRlIHRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMudG91Y2htb3ZlO1xuXG4gICAgICBpZiAoXG4gICAgICAgICh0aGlzLnNjcm9sbENvbnRhaW5lciAmJiB0aGlzLnNjcm9sbENvbnRhaW5lci5hY3RpdmVMb25nUHJlc3NEcmFnKSB8fFxuICAgICAgICB0aGlzLnRvdWNoU3RhcnRMb25nUHJlc3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmVuYWJsZVNjcm9sbCgpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnBvaW50ZXJVcCQubmV4dCh7XG4gICAgICBldmVudCxcbiAgICAgIGNsaWVudFg6IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFgsXG4gICAgICBjbGllbnRZOiBldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZLFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBvbk1vdXNlRW50ZXIoKTogdm9pZCB7XG4gICAgdGhpcy5zZXRDdXJzb3IodGhpcy5kcmFnQ3Vyc29yKTtcbiAgfVxuXG4gIHByaXZhdGUgb25Nb3VzZUxlYXZlKCk6IHZvaWQge1xuICAgIHRoaXMuc2V0Q3Vyc29yKCcnKTtcbiAgfVxuXG4gIHByaXZhdGUgY2FuRHJhZygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5kcmFnQXhpcy54IHx8IHRoaXMuZHJhZ0F4aXMueTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0Q3Vyc29yKHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuZXZlbnRMaXN0ZW5lclN1YnNjcmlwdGlvbnMubW91c2Vtb3ZlKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LCAnY3Vyc29yJywgdmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdW5zdWJzY3JpYmVFdmVudExpc3RlbmVycygpOiB2b2lkIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLmV2ZW50TGlzdGVuZXJTdWJzY3JpcHRpb25zKS5mb3JFYWNoKCh0eXBlKSA9PiB7XG4gICAgICAodGhpcyBhcyBhbnkpLmV2ZW50TGlzdGVuZXJTdWJzY3JpcHRpb25zW3R5cGVdKCk7XG4gICAgICBkZWxldGUgKHRoaXMgYXMgYW55KS5ldmVudExpc3RlbmVyU3Vic2NyaXB0aW9uc1t0eXBlXTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0RWxlbWVudFN0eWxlcyhcbiAgICBlbGVtZW50OiBIVE1MRWxlbWVudCxcbiAgICBzdHlsZXM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH1cbiAgKSB7XG4gICAgT2JqZWN0LmtleXMoc3R5bGVzKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoZWxlbWVudCwga2V5LCBzdHlsZXNba2V5XSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGdldFNjcm9sbEVsZW1lbnQoKSB7XG4gICAgaWYgKHRoaXMuc2Nyb2xsQ29udGFpbmVyKSB7XG4gICAgICByZXR1cm4gdGhpcy5zY3JvbGxDb250YWluZXIuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5kb2N1bWVudC5ib2R5O1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0U2Nyb2xsUG9zaXRpb24oKSB7XG4gICAgaWYgKHRoaXMuc2Nyb2xsQ29udGFpbmVyKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0b3A6IHRoaXMuc2Nyb2xsQ29udGFpbmVyLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zY3JvbGxUb3AsXG4gICAgICAgIGxlZnQ6IHRoaXMuc2Nyb2xsQ29udGFpbmVyLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zY3JvbGxMZWZ0LFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdG9wOiB3aW5kb3cucGFnZVlPZmZzZXQgfHwgdGhpcy5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wLFxuICAgICAgICBsZWZ0OiB3aW5kb3cucGFnZVhPZmZzZXQgfHwgdGhpcy5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdCxcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzaG91bGRCZWdpbkRyYWcoXG4gICAgZXZlbnQ6IFRvdWNoRXZlbnQsXG4gICAgdG91Y2hNb3ZlRXZlbnQ6IFRvdWNoRXZlbnQsXG4gICAgc3RhcnRTY3JvbGxQb3NpdGlvbjogeyB0b3A6IG51bWJlcjsgbGVmdDogbnVtYmVyIH1cbiAgKTogYm9vbGVhbiB7XG4gICAgY29uc3QgbW92ZVNjcm9sbFBvc2l0aW9uID0gdGhpcy5nZXRTY3JvbGxQb3NpdGlvbigpO1xuICAgIGNvbnN0IGRlbHRhU2Nyb2xsID0ge1xuICAgICAgdG9wOiBNYXRoLmFicyhtb3ZlU2Nyb2xsUG9zaXRpb24udG9wIC0gc3RhcnRTY3JvbGxQb3NpdGlvbi50b3ApLFxuICAgICAgbGVmdDogTWF0aC5hYnMobW92ZVNjcm9sbFBvc2l0aW9uLmxlZnQgLSBzdGFydFNjcm9sbFBvc2l0aW9uLmxlZnQpLFxuICAgIH07XG4gICAgY29uc3QgZGVsdGFYID1cbiAgICAgIE1hdGguYWJzKFxuICAgICAgICB0b3VjaE1vdmVFdmVudC50YXJnZXRUb3VjaGVzWzBdLmNsaWVudFggLSBldmVudC50b3VjaGVzWzBdLmNsaWVudFhcbiAgICAgICkgLSBkZWx0YVNjcm9sbC5sZWZ0O1xuICAgIGNvbnN0IGRlbHRhWSA9XG4gICAgICBNYXRoLmFicyhcbiAgICAgICAgdG91Y2hNb3ZlRXZlbnQudGFyZ2V0VG91Y2hlc1swXS5jbGllbnRZIC0gZXZlbnQudG91Y2hlc1swXS5jbGllbnRZXG4gICAgICApIC0gZGVsdGFTY3JvbGwudG9wO1xuICAgIGNvbnN0IGRlbHRhVG90YWwgPSBkZWx0YVggKyBkZWx0YVk7XG4gICAgY29uc3QgbG9uZ1ByZXNzQ29uZmlnID0gdGhpcy50b3VjaFN0YXJ0TG9uZ1ByZXNzXG4gICAgICA/IHRoaXMudG91Y2hTdGFydExvbmdQcmVzc1xuICAgICAgOiAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgICB7XG4gICAgICAgICAgZGVsdGE6IHRoaXMuc2Nyb2xsQ29udGFpbmVyLmxvbmdQcmVzc0NvbmZpZy5kZWx0YSxcbiAgICAgICAgICBkZWxheTogdGhpcy5zY3JvbGxDb250YWluZXIubG9uZ1ByZXNzQ29uZmlnLmR1cmF0aW9uLFxuICAgICAgICB9O1xuICAgIGlmIChcbiAgICAgIGRlbHRhVG90YWwgPiBsb25nUHJlc3NDb25maWcuZGVsdGEgfHxcbiAgICAgIGRlbHRhU2Nyb2xsLnRvcCA+IDAgfHxcbiAgICAgIGRlbHRhU2Nyb2xsLmxlZnQgPiAwXG4gICAgKSB7XG4gICAgICB0aGlzLnRpbWVMb25nUHJlc3MudGltZXJCZWdpbiA9IERhdGUubm93KCk7XG4gICAgfVxuICAgIHRoaXMudGltZUxvbmdQcmVzcy50aW1lckVuZCA9IERhdGUubm93KCk7XG4gICAgY29uc3QgZHVyYXRpb24gPVxuICAgICAgdGhpcy50aW1lTG9uZ1ByZXNzLnRpbWVyRW5kIC0gdGhpcy50aW1lTG9uZ1ByZXNzLnRpbWVyQmVnaW47XG4gICAgaWYgKGR1cmF0aW9uID49IGxvbmdQcmVzc0NvbmZpZy5kZWxheSkge1xuICAgICAgdGhpcy5kaXNhYmxlU2Nyb2xsKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBlbmFibGVTY3JvbGwoKSB7XG4gICAgaWYgKHRoaXMuc2Nyb2xsQ29udGFpbmVyKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKFxuICAgICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICdvdmVyZmxvdycsXG4gICAgICAgICcnXG4gICAgICApO1xuICAgIH1cbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZG9jdW1lbnQuYm9keSwgJ292ZXJmbG93JywgJycpO1xuICB9XG5cbiAgcHJpdmF0ZSBkaXNhYmxlU2Nyb2xsKCkge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgaWYgKHRoaXMuc2Nyb2xsQ29udGFpbmVyKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKFxuICAgICAgICB0aGlzLnNjcm9sbENvbnRhaW5lci5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICdvdmVyZmxvdycsXG4gICAgICAgICdoaWRkZW4nXG4gICAgICApO1xuICAgIH1cbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZG9jdW1lbnQuYm9keSwgJ292ZXJmbG93JywgJ2hpZGRlbicpO1xuICB9XG5cbiAgcHJpdmF0ZSBoYXNTY3JvbGxiYXIoKTogYm9vbGVhbiB7XG4gICAgY29uc3Qgc2Nyb2xsQ29udGFpbmVyID0gdGhpcy5nZXRTY3JvbGxFbGVtZW50KCk7XG4gICAgY29uc3QgY29udGFpbmVySGFzSG9yaXpvbnRhbFNjcm9sbCA9XG4gICAgICBzY3JvbGxDb250YWluZXIuc2Nyb2xsV2lkdGggPiBzY3JvbGxDb250YWluZXIuY2xpZW50V2lkdGg7XG4gICAgY29uc3QgY29udGFpbmVySGFzVmVydGljYWxTY3JvbGwgPVxuICAgICAgc2Nyb2xsQ29udGFpbmVyLnNjcm9sbEhlaWdodCA+IHNjcm9sbENvbnRhaW5lci5jbGllbnRIZWlnaHQ7XG4gICAgcmV0dXJuIGNvbnRhaW5lckhhc0hvcml6b250YWxTY3JvbGwgfHwgY29udGFpbmVySGFzVmVydGljYWxTY3JvbGw7XG4gIH1cbn1cbiJdfQ==