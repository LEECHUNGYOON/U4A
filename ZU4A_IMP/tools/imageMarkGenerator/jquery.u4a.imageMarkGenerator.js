!function(a) {

    a.u4aImgMapGenerator = true;

    var b = 0
      , c = {}
      , d = {
        defaults: {
            src: "",
            file: "",
            style: {
                fill: "#666",
                stroke: "#333",
                strokeWidth: "1",
                opacity: "0.6",
                cursor: "pointer"
            },
            pointStyle: {
                fill: "#fff",
                stroke: "#333",
                strokeWidth: "1",
                opacity: "0.6",
                cursor: "pointer"
            },
            event: {
                init: function() {},
                update: function() {},
                addArea: function() {},
                removeArea: function() {}
            }
        },
        init: function(e, f) {

            var sMapId = this.id,
                sMapcls_org = "image-mapper-img",
                sMapcls = sMapId + "--" + sMapcls_org,
                sMapSvg_org = "image-mapper-svg",
                sMapSvgcls = sMapId + "--" + sMapSvg_org,
                oMapInfo = this.oMapInfo,

                sMapImgId = sMapId + '-img',
                sMapSvgId = sMapId + '-svg';

            oMapInfo.mapId = sMapId,
            oMapInfo.mapCls = sMapcls,
            oMapInfo.mapSvg = sMapSvgcls;

            var g = this
              , h = a(this)
              , f = f || {};
            if (!e) {
                f = a.extend(!0, d.defaults, f),
                c[b] = {
                    state: {
                        isLoaded: !1,
                        areaIndex: 0,
                        areaLength: 0
                    },
                    area: [],
                    options: f
                },
                e = b,
                h.data("imageMapper", b++),
                h.addClass("image-mapper"),
                h.html(
                    '<img id="' + sMapImgId + '" class="' + sMapcls +  ' ' + sMapcls_org + '"  />' +
                    '<svg id="' + sMapSvgId + '" class="' + sMapSvgcls + ' ' + sMapSvg_org + '" />'
                );

                var i = a("." + sMapcls, h);

                i[0].onload = function() {
                    c[e].state.isLoaded = !0
                },
                c[e].options.src.length > 0 && i.attr("src", c[e].options.src),
                d.bindEvents.apply(this, [e]),
                d.bindInputs.apply(this, [e]),
                d.addArea(e, "rect"),
                "function" == typeof c[e].options.event.init && c[e].options.event.init.apply(g),
                d.bindValues(e)
            }
        },
        update: function(b, e) {

            var oMapInfo = this.oMapInfo,
                sMapCls = oMapInfo.mapCls;

            var f = this
              , g = a(this)
              , e = e || {};
            if (b >= 0) {
                e = a.extend(!0, c[b].options, e),
                c[b] = {
                    state: {
                        isLoaded: !1,
                        areaIndex: 0,
                        areaLength: 0
                    },
                    area: [],
                    options: e
                };
                var h = a("." + sMapCls, g);
                "src"in e && h.attr("src", c[b].options.src),
                d.addArea(b, "rect"),
                d.refresh.apply(this, [b]),
                "function" == typeof c[b].options.event.update && c[b].options.event.update.apply(f)
            }
        },
        bindEvents: function(b) {

            var oMapInfo = this.oMapInfo,
                sMapCls = oMapInfo.mapCls,
                sMapShapeId = oMapInfo.mapShapeId,
                sMapPointId = oMapInfo.mapntId;

            var e = this
              , f = a(this);
            a(window).on("resize", function() {
                d.refresh.apply(e, [b])
            }),
            f.on("click", function(a) {

                var oMapInfo = this.oMapInfo,
                    bIsFileLoaded = oMapInfo.fileLoaded;

                if(!bIsFileLoaded){
                    return;
                }

                var f = d.getPosition.apply(e, [b, a]);
                d.addPoint.apply(e, [b, f]),
                "function" == typeof c[b].options.event.update && c[b].options.event.update.apply(e)
            });
            var g, h;
            f.on("mousemove touchmove", function(f) {

                if (!g)
                    return !0;
                var i = "undefined" != typeof f.originalEvent.touches || !1
                  , j = d.getPosition.apply(e, [b, f, i])
                  , k = d.getClientPosition.apply(e, [b, j])
                  , l = d.getRatio.apply(e)
                  , m = g.data("areaIndex")
                  , n = a("." + sMapCls, e)
                  , o = []
                  , p = !1;
                a.each(c[b].area[m].coords, function(a, b) {
                    var c = {
                        naturalX: b.naturalX + Math.round((k.clientX - h.clientX) * l.ratioX),
                        naturalY: b.naturalY + Math.round((k.clientY - h.clientY) * l.ratioY)
                    };
                    c.naturalX < 0 || c.naturalX >= n[0].naturalWidth ? p = !0 : (c.naturalY < 0 || c.naturalY >= n[0].naturalHeight) && (p = !0),
                    o[a] = c
                }),
                p || (c[b].area[m].coords = o,
                d.refresh.apply(e, [b])),
                h = k,
                f.preventDefault(),
                f.stopImmediatePropagation()

            }),
            f.on("mouseup touchend mouseleave touchleave", function(a) {

                var b = "undefined" != typeof a.originalEvent.touches || !1;
                g && (0 === a.button || b) && (g = !1)

            }),
            f.on("mousedown touchstart", "." + sMapShapeId, function(c) {

                var f = "undefined" != typeof c.originalEvent.touches || !1;
                if (0 === c.button || f) {
                    var i = d.getPosition.apply(e, [b, c, f])
                      , j = d.getClientPosition.apply(e, [b, i]);
                    g = a(this),
                    h = j
                }
            });
            var i;
            f.on("mousemove touchmove", function(a) {

                if (!i)
                    return !0;
                var f = "undefined" != typeof a.originalEvent.touches || !1
                  , g = d.getPosition.apply(e, [b, a, f])
                  , h = d.getClientPosition.apply(e, [b, g]);
                c[b].area[i.data("areaIndex")].coords[i.data("coordIndex")] = g,
                i.attr("cx", h.clientX).attr("cy", h.clientY),
                d.renderSVG.apply(e, [b]),
                a.preventDefault(),
                a.stopImmediatePropagation()
            }),
            f.on("mouseup touchend mouseleave touchleave", function(a) {

                var b = "undefined" != typeof a.originalEvent.touches || !1;
                i && (0 === a.button || b) && (i = !1)
            }),
            f.on("mousedown touchstart", "." + sMapPointId, function(b) {

                var c = "undefined" != typeof b.originalEvent.touches || !1;
                (0 === b.button || c) && (i = a(this))
            }),
            f.on("click", "." + sMapPointId, function(a) {

                a.preventDefault(),
                a.stopImmediatePropagation()
            }),
            f.on("mouseup touchend", "." + sMapPointId, function(f) {
                2 == f.button && (c[b].area[a(this).data("areaIndex")].coords.splice(a(this).data("coordIndex"), 1),
                d.refresh.apply(e, [b]))
            }),
            f.on("contextmenu", function(a) {
                a.preventDefault()
            })
        },
        bindValues: function(b) {

            a.each(c[b].options.input, function(d, e) {
                var f = a(e.selector);
                f.each(function() {
                    var d = e.fn.apply(this);
                    "active" == d[1] ? a(this).attr("checked", d[0] == c[b].state.areaIndex ? "checked" : !1) : a(this).val(c[b].area[d[0]][d[1]])
                })
            })
        },
        bindInputs: function(b) {

            var e = this;
            a.each(c[b].options.input, function(f, g) {
                var h = a(g.selector);
                h.is("button") ? a(document).on("click", g.selector, function() {

                    var a = g.fn.apply(this);
                    "remove" == a[1] && (d.removeArea.apply(e, [b, a[0]]),
                    d.refresh.apply(e, [b]))
                }) : a(document).on("change", g.selector, function() {
                    var f = a(this)
                      , h = g.fn.apply(this)
                      , i = f.val();
                    "active" == h[1] ? (a(g.selector).not(this).attr("checked", !1),
                    c[b].state.areaIndex = h[0],
                    d.refresh.apply(e, [b])) : c[b].area[h[0]][h[1]] = i
                })
            })
        },
        getData: function(a) {
            return c[a]
        },
        getRatio: function() {

            var oMapInfo = this.oMapInfo,
                sMapCls = oMapInfo.mapCls;

            var b = a("." + sMapCls, this);
            return {
                ratioX: b[0].naturalWidth / b[0].clientWidth,
                ratioY: b[0].naturalHeight / b[0].clientHeight
            }
        },
        getPosition: function(b, c, e) {

            var oMapInfo = this.oMapInfo,
                sMapCls = oMapInfo.mapCls;

            var f = a("." + sMapCls, this)
              , g = f.offset()
              , h = d.getRatio.apply(this, [b])
              , i = {
                naturalX: 0,
                naturalY: 0
            };
            return e ? (i.naturalX = Math.round((c.originalEvent.targetTouches[0].pageX - g.left) * h.ratioX),
            i.naturalY = Math.round((c.originalEvent.targetTouches[0].pageY - g.top) * h.ratioY)) : (i.naturalX = Math.round((c.clientX + (window.scrollX || window.pageXOffset) - g.left) * h.ratioX),
            i.naturalY = Math.round((c.clientY + (window.scrollY || window.pageYOffset) - g.top) * h.ratioY)),
            i
        },
        getClientPosition: function(b, c) {

            var oMapInfo = this.oMapInfo,
                sMapCls = oMapInfo.mapCls;

            var e = a("." + sMapCls, this)
              , f = (e.offset(),
            d.getRatio.apply(this, [b]))
              , g = {
                clientX: 0,
                clientY: 0
            };
            return g.clientX = Math.round(c.naturalX / f.ratioX),
            g.clientY = Math.round(c.naturalY / f.ratioY),
            g
        },
        refresh: function(a) {
            d.renderSVG.apply(this, [a]),
            d.renderPoints.apply(this, [a])
        },
        addPoint: function(a, b) {
            d.addCoord(a, b),
            d.refresh.apply(this, [a])
        },
        addArea: function(b, d) {

            1 == arguments.length && (d = b,
            b = a(this).data("imageMapper")),
            c[b].area[c[b].state.areaLength] = {
                el: !1,
                shape: d,
                href: "",
                title: "",
                target: "",
                coords: []
            },
            c[b].state.areaLength++,
            "function" == typeof c[b].options.event.addArea && c[b].options.event.addArea.apply(this)
        },
        removeArea: function(a, b) {

            c[a].area.splice(b, 1),
            c[a].state.areaLength--,
            c[a].state.areaIndex >= c[a].state.areaLength ? c[a].state.areaIndex = 0 : c[a].state.areaIndex == b && 0 !== b && c[a].state.areaIndex--,
            0 === c[a].state.areaLength && d.addArea(a, "rect"),
            "function" == typeof c[a].options.event.removeArea && c[a].options.event.removeArea.apply(this)

        },
        addCoord: function(a, b) {

            var d = c[a].state.areaIndex
              , e = c[a].area[d].shape;
            (-1 == ["circle", "rect"].indexOf(e) || 2 != c[a].area[d].coords.length) && c[a].area[d].coords.push(b)

        },
        renderSVG: function(b) {

            var oMapInfo = this.oMapInfo,
                sMapSvg = oMapInfo.mapSvg,
                sShape = oMapInfo.mapShapeId;

            var e = this
              , f = a("." + sMapSvg, this);
            f.css("width", "100%"),
            a("." + sShape, f).remove(),
            a.each(c[b].area, function(g, h) {
                var i, j = [];
                a.each(h.coords, function(a, c) {
                    var f = d.getClientPosition.apply(e, [b, c]);
                    j.push(f.clientX, f.clientY)
                }),
                h.el && (i = h.el),
                "poly" == h.shape ? (i || (i = a(document.createElementNS("http://www.w3.org/2000/svg", "polygon"))),
                i.attr("points", j.join(","))) : "circle" == h.shape ? j.length >= 4 && (i || (i = a(document.createElementNS("http://www.w3.org/2000/svg", "circle"))),
                i.attr("cx", j[0]).attr("cy", j[1]),
                i.attr("r", Math.sqrt(Math.pow(j[2] - j[0], 2) + Math.pow(j[3] - j[1], 2)))) : j.length >= 4 && (i || (i = a(document.createElementNS("http://www.w3.org/2000/svg", "rect"))),
                i.attr("x", Math.min(j[0], j[2])).attr("y", Math.min(j[1], j[3])),
                i.attr("width", Math.abs(j[2] - j[0])).attr("height", Math.abs(j[3] - j[1]))),
                i && (i.attr("class", sShape),
                i.attr("data-area-index", g),
                i.css(c[b].options.style),
                f.prepend(i),
                c[b].area[g].el = i)
            })
        },
        renderPoints: function(b) {

            var oMapInfo = this.oMapInfo,
                sMapSvg = oMapInfo.mapSvg,
                sPoint = oMapInfo.mapntId;

            var e = this
              , f = a("." + sMapSvg, this);
            a("." + sPoint, f).remove();
            var g = c[b].state.areaIndex
              , h = c[b].area[g];
            a.each(h.coords, function(h, i) {
                var j = a(document.createElementNS("http://www.w3.org/2000/svg", "circle"))
                  , k = d.getClientPosition.apply(e, [b, i]);
                j.attr("cx", k.clientX).attr("cy", k.clientY),
                j.attr("r", 5),
                j.attr("class", sPoint),
                j.attr("data-area-index", g),
                j.attr("data-coord-index", h),
                j.css(c[b].options.pointStyle),
                f.append(j)
            })
        }
    };
    a.fn.imageMapper = function() {

        var b = "string" == typeof arguments[0] ? arguments[0] : "init"
          , c = ("object" == typeof arguments[0] ? 0 : 1) || {}
          , e = Array.prototype.slice.call(arguments, c)
          , f = a(this).data("imageMapper");
        return "getData" == b ? d.getData(f) : "asHTML" == b ? d.asHTML(f) : (e.unshift(f),
        this.each(function() {
            "function" == typeof d[b] && d[b].apply(this, e)
        }))
    },
    a.fn.imageMapperRemove = function(bb){

        var e = this[0],
            b = this.data("imageMapper");

        d.removeArea.apply(e, [b, 0]);
        d.refresh.apply(e, [b]);

    },

    a.fn.imageMapperTypeChange = function(oMarkInfo){

      var b = oMarkInfo.markIdx,
          e = this[0];

      c[b].state.areaIndex = 0;
      d.refresh.apply(e, [b]);
      c[b].area[0]["shape"] = oMarkInfo.shapeType;

    }

}(jQuery),
function(a) {

    a(document).on("ImageMapInit", function(event, oParam) {

        var sMapId = oParam.mapId;

        function b(a) {
            for (var b = "", c = new Uint8Array(a), d = c.byteLength, e = 0; d > e; e++)
                b += String.fromCharCode(c[e]);
            return window.btoa(b)
        }

        a(document).on("update", sMapId, function() {

            var b = a(this)
              , c = b.imageMapper("getData");
            0 == c.options.src.length ? a(".toggle-content").hide() : a(".toggle-content").show()

        }),
        a(sMapId).imageMapper({
            src: "",
            event: {
                init: function() {
                    a(sMapId).trigger("update")
                },
                update: function() {
                    a(sMapId).trigger("update")
                },
                removeArea: function() {

                    a(sMapId).trigger("update")
                }
            }
        })
    })
}(jQuery);