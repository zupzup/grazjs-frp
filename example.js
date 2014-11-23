function clearContent() {
    $("#content").empty();
}

function logContent(data) {
    $("#content").append("<div>" + data + "</div>");
    console.log(data);
}

$(function() {
    var data  = [1, 2, 3, 4],
        $inp = $('#inp');

    var keyup = Rx.Observable.fromEvent($inp, 'keyup').map(function(e) {
        return e.target.value; 
    }).filter(function(e) {
        return e.length > 2; 
    }).debounce(500).distinctUntilChanged();


    fromWebSocket = function(address, protocol, openObserver) {
        var ws = new WebSocket(address, protocol);

        var observable = Rx.Observable.create (function (obs) {
            if (openObserver) {
                ws.onopen = function (e) {
                    openObserver.onNext(e);
                    openObserver.onCompleted();
                };
            }

            ws.onmessage = obs.onNext.bind(obs);
            ws.onerror = obs.onError.bind(obs);
            ws.onclose = obs.onCompleted.bind(obs);

            return ws.close.bind(ws);
        });
        var observer = Rx.Observer.create(function (data) {
            if (ws.readyState === WebSocket.OPEN) { ws.send(data); }
        });

        return Rx.Subject.create(observer, observable);
    };

    var socketSubject = fromWebSocket('ws://localhost:5050', 'echo-protocol', Rx.Observer.create(function() {
        socketSubject.onNext('42');
        socketSubject.onNext('yarr');
        socketSubject.onNext('arrr');
        keyup.subscribe(function(text) {
            console.log(text);
            socketSubject.onNext(text);
        });
    }));

    socketSubject.subscribe(
        function (data) {
            console.log(data);
            logContent(data.data);
        }
    );
});

