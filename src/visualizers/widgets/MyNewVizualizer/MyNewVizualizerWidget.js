/*globals define, WebGMEGlobal*/

/**
 * Generated by VisualizerGenerator 1.7.0 from webgme on Sun Nov 22 2020 15:55:48 GMT-0500 (Eastern Standard Time).
 */

define(['jointjs', 'css!./styles/MyNewVizualizerWidget.css', 'css!jointjscss'], function (jointjs) {
    'use strict';

    var WIDGET_CLASS = 'my-new-vizualizer';

    function MyNewVizualizerWidget(logger, container) {
        console.log(jointjs)
        this._logger = logger.fork('Widget');

        this._el = container;

        this.nodes = {};
        this._initialize();

        this._logger.debug('ctor finished');
    }

    MyNewVizualizerWidget.prototype._initialize = function () {
        var width = this._el.width(),
            height = this._el.height(),
            self = this;

    
        // set the widget class addted this stuff below
        this._el.addClass(WIDGET_CLASS);

        

        this._graph = null;
        this._paper = null;

        this._graph = new jointjs.dia.Graph;
        this._paper = new jointjs.dia.Paper({
        
            el: $(this._el), 
            width: width,
            height: height,
            gridSize: 1,
            defaultAnchor: {name: 'perpendicular'}, 
            defaultConnectionPoint: {name: 'boundary'},
            model:this._graph
        });

        this._paper.setInteractivity(false);
        this._paper.removeTools();

        this._paper.on('element:pointerdown', function(elementView) {
            var currentElement = elementView.model;
            console.log(currentElement);
        })

        this._place = jointjs.dia.Element.define('network.Place', {
            attrs: {
                circle: {
                    r: 25,
                    'stroke-width': 3,
                    stroke: '#000000',
                    fill: '#aabbaa',
                    cursor: 'pointer'
                },
                text: {
                    'font-weight': '800',
                    'text-anchor': 'middle',
                    'ref-x': .5,
                    'ref-y':-20,
                    'ref': 'circle',
                    cursor: 'pointer'
                },
                label: {
                    'font-weight': '400',
                    'text-anchor': 'middle',
                    'ref-y': 20,
                    'ref': 'circle',
                    cursor: 'pointer'
                }
            }
        }, { 
            markup: [{
                tagName: 'circle',
                selector: 'circle'
            }, {
                tagName: 'text',
                selector: 'text'  
            }, {
                tagName: 'text',
                selector: 'label' 
            }]
        });

        
        // set widget class
        //this._el.addClass(WIDGET_CLASS);

        // Create a dummy header
        this._el.append('<h3>MyNewVizualizer Events:</h3>');

        // Registering to events can be done with jQuery (as normal)
        this._el.on('dblclick', function (event) {
            event.stopPropagation();
            event.preventDefault();
            self.onBackgroundDblClick();
        });
    };

    MyNewVizualizerWidget.prototype.onWidgetContainerResize = function (width, height) {
        this._logger.debug('Widget is resizing...');
        // added this
        if (this._paper) {
            this._paper.setDimensions(width, height);
            this._paper.scaleContentToFit();
        }
    };

    // Adding/Removing/Updating items
    MyNewVizualizerWidget.prototype.addNode = function (desc) {
        //this.initNetwork();
        
        if (desc) {
            // Add node to a table of nodes
            var node = document.createElement('div'),
                label = 'children';

            if (desc.childrenIds.length === 1) {
                label = 'child';
            }

            this.nodes[desc.id] = desc;
            node.innerHTML = 'Adding node "' + desc.name + '" (click to view). It has ' +
                desc.childrenIds.length + ' ' + label + '.';

            this._el.append(node);
            node.onclick = this.onNodeClick.bind(this, desc.id);
        }
        
    };

    MyNewVizualizerWidget.prototype.removeNode = function (gmeId) {
        
        var desc = this.nodes[gmeId];
        this._el.append('<div>Removing node "' + desc.name + '"</div>');
        delete this.nodes[gmeId];
        
    };

    MyNewVizualizerWidget.prototype.updateNode = function (desc) {
        
        if (desc) {
            this._logger.debug('Updating node:', desc);
            this._el.append('<div>Updating node "' + desc.name + '"</div>');
        }
        
    };

    // adding this
    MyNewVizualizerWidget.prototype.initNetwork = function(descriptor) {
        
        
        var pn = jointjs.shapes.pn;

        var pReady = new pn.Place({
            position: { x: 140, y: 50 },
            attrs: {
                '.label': {
                    'text': 'ready',
                    'fill': '#7c68fc' },
                '.root': {
                    'stroke': '#9586fd',
                    'stroke-width': 3
                },
                '.tokens > circle': {
                    'fill': '#7a7e9b'
                }
            },
            tokens: 1
        });

        var pIdle = pReady.clone()
            .attr('.label/text', 'idle')
            .position(140, 260)
            .set('tokens', 2);

        var buffer = pReady.clone()
            .position(350, 160)
            .set('tokens', 12)
            .attr({
                '.label': {
                    'text': 'buffer'
                },
                '.alot > text': {
                    'fill': '#fe854c',
                    'font-family': 'Courier New',
                    'font-size': 20,
                    'font-weight': 'bold',
                    'ref-x': 0.5,
                    'ref-y': 0.5,
                    'y-alignment': -0.5,
                    'transform': null
                }
            });

        var cAccepted = pReady.clone()
            .attr('.label/text', 'accepted')
            .position(550, 50)
            .set('tokens', 1);

        var cReady = pReady.clone()
            .attr('.label/text', 'accepted')
            .position(560, 260)
            .set('ready', 3);

        var pProduce = new pn.Transition({
            position: { x: 50, y: 160 },
            attrs: {
                '.label': {
                    'text': 'produce',
                    'fill': '#fe854f'
                },
                '.root': {
                    'fill': '#9586fd',
                    'stroke': '#9586fd'
                }
            }
        });

        var pSend = pProduce.clone()
            .attr('.label/text', 'send')
            .position(270, 160);

        var cAccept = pProduce.clone()
            .attr('.label/text', 'accept')
            .position(470, 160);

        var cConsume = pProduce.clone()
            .attr('.label/text', 'consume')
            .position(680, 160);


        function link(a, b) {

            return new pn.Link({
                source: { id: a.id, selector: '.root' },
                target: { id: b.id, selector: '.root' },
                attrs: {
                    '.connection': {
                        'fill': 'none',
                        'stroke-linejoin': 'round',
                        'stroke-width': '2',
                        'stroke': '#4b4a67'
                    }
                }
            });
        }

        this._graph.addCell([pReady, pIdle, buffer, cAccepted, cReady, pProduce, pSend, cAccept, cConsume]);

        this._graph.addCell([
            link(pProduce, pReady),
            link(pReady, pSend),
            link(pSend, pIdle),
            link(pIdle, pProduce),
            link(pSend, buffer),
            link(buffer, cAccept),
            link(cAccept, cAccepted),
            link(cAccepted, cConsume),
            link(cConsume, cReady),
            link(cReady, cAccept)
        ]);
        

        var pReady = new pn.Place({
            position: { x: 140, y: 50 },
            attrs: {
                '.label': {
                    'text': 'ready',
                    'fill': '#7c68fc' },
                '.root': {
                    'stroke': '#9586fd',
                    'stroke-width': 3
                },
                '.tokens > circle': {
                    'fill': '#7a7e9b'
                }
            },
            tokens: 1
        });
        
        var pIdle = pReady.clone()
            .attr('.label/text', 'idle')
            .position(140, 260)
            .set('tokens', 2);
        
        var buffer = pReady.clone()
            .position(350, 160)
            .set('tokens', 12)
            .attr({
                '.label': {
                    'text': 'buffer'
                },
                '.alot > text': {
                    'fill': '#fe854c',
                    'font-family': 'Courier New',
                    'font-size': 20,
                    'font-weight': 'bold',
                    'ref-x': 0.5,
                    'ref-y': 0.5,
                    'y-alignment': -0.5,
                    'transform': null
                }
            });
        
        var cAccepted = pReady.clone()
            .attr('.label/text', 'accepted')
            .position(550, 50)
            .set('tokens', 1);
        
        var cReady = pReady.clone()
            .attr('.label/text', 'accepted')
            .position(560, 260)
            .set('ready', 3);

        

        /*
        
        const pn = jointjs.shapes.pn;
        const place1 = new pn.Place({
            position: {x: 100, y: 100}, 
            attrs: {
                label: {
                    text: 'ready', 
                    fill: '#7c68fc'
                }, root: {
                    'stroke': '#9586fd',
                    'stroke-width': 3
                }
            }, 
            tokens: 2
        });

        const place2 = new this._place({
            position: {x: 200, y: 200}, 
            attrs: {
                text: {
                    text: 'whatever'
                }, 
                label: {
                    text: 'other'
                }
            }
        });

        const transition1 = new pn.Transition({
            position: {x: 50, y: 100},
            attrs: {
                '.label': {
                    'text': 'produce',
                    'fill': '#fe854f'
                }, 
                '.root':{
                    'fill': '#9586fd',
                    'stroke': '#9586fd'
                }
            }
        });
        
        const link2 = new jointjs.shapes.standard.Link();
        link2.source(place1);
        link2.target(transition1);

        this._graph.addCell([place1,transition1, link2, place2]);

        setTimeout(()=> {
            link2.findView(this._paper).sendToken(jointjs.V('circle', {r: 5, fill: '#feb662'}), 500, () => {console.log('toke sent'); place2.attr('label/text', '1')});
        }, 1000);
        */
    };


    /* * * * * * * * Visualizer event handlers * * * * * * * */
    
    
    //adding this one
    MyNewVizualizerWidget.prototype.onElementClick = function(elementView, event) {
        event.stopPropagation();
        console.log(elementView);
    };
    
    
    MyNewVizualizerWidget.prototype.onNodeClick = function (/*id*/) {
        // This currently changes the active node to the given id and
        // this is overridden in the controller.
    };

    MyNewVizualizerWidget.prototype.onBackgroundDblClick = function () {
        this._el.append('<div>Background was double-clicked!!</div>');
    };

    /* * * * * * * * Visualizer life cycle callbacks * * * * * * * */
    MyNewVizualizerWidget.prototype.destroy = function () {
    };

    MyNewVizualizerWidget.prototype.onActivate = function () {
        this._logger.debug('MyNewVizualizerWidget has been activated');
    };

    MyNewVizualizerWidget.prototype.onDeactivate = function () {
        this._logger.debug('MyNewVizualizerWidget has been deactivated');
    };

    return MyNewVizualizerWidget;
});

