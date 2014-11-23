function clearContent() {
    $("#content").empty();
}

function logContent(data) {
    $("#content").append("<div>" + data + "</div>");
    console.log(data);
}

$(function() {
    var range = Rx.Observable.range(1, 1000),
        intervalStream = Rx.Observable.interval(100);

        var buffer = Rx.Observable.zip(range, intervalStream, function(value, tick) {
            return value; 
        })
        .bufferWithTime(500)
        .map(function(e) {
            var values = e.reduce(function(acc, i) {
                return acc + i; 
            });
            return {sum: values, values: e};
        })
        .takeUntil(Rx.Observable.timer(5000));
   
   var sub = buffer.subscribe(function(x) {
        logContent("sum:" + x.sum + " values: " + x.values);
   });
});

