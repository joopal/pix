(function() {
    var app = angular.module('dreambook', ['ngAnimate']);

    app.controller('DreamController', ['$scope', function($scope) {
        var cnvs = document.getElementsByTagName('canvas');
        cnvs[1].style.opacity = "0.2"; cnvs[2].style.opacity = "0.2";
        var ctxs = []; for (var i = 0; i < cnvs.length; i++) {
            ctxs[i] = cnvs[i].getContext('2d');
        }
        ctxs[0].globalCompositeOperation = 'screen';
        ctxs[1].globalCompositeOperation = 'overlay';
        var CW = cnvs[0].width, CH = cnvs[0].height;

        window.fbAsyncInit = function() {
            FB.init({
                appId      : '798590223572873',
                cookie     : true,  // enable cookies to allow the server to access
                // the session
                xfbml      : true,  // parse social plugins on this page
                version    : 'v2.3'
            });
            FB.getLoginStatus(function(response) {
                statusChangeCallback(response);
            });
        };
        // This is called with the results from from FB.getLoginStatus().
        function statusChangeCallback(response) {
            if (response.status === 'connected') {
                onConnected();
            } else {
                $scope.$apply(function() {
                    $scope.accessToken = -1;
                });
            }
        }
        var onConnected = function() {
            FB.api('/me?fields=name,picture.width(9999)', function(response) {
                var pic = response.picture.data;
                $scope.$apply(function() {
                    pic = {
                        url    : 'https://scontent-iad3-1.xx.fbcdn.net/hphotos-xaf1/v/t1.0-9/11902472_10153577250263836_6676092254720062095_n.jpg?oh=37e571692c23338de65426f641445225&oe=56B77B46',
                        width  : 750,
                        height : 750,
                    }
                    $scope.accessToken = FB.getAuthResponse()['accessToken'];
                    $scope.profileCanvasStyle = {
                        'width'  : (pic.width  * 1.00) +'px',
                        'height' : (pic.height * 1.00) +'px',
                    };
                    $scope.profileImgStyle = {
                        'background-image' : 'url('+pic.url+')',
                        'background-image' : 'url('+pic.url+')',
                        'min-width'        : (pic.width  * 1.00) +'px',
                        'min-height'       : (pic.height * 1.00) +'px',
                        'max-width'        : (pic.width  * 1.00) +'px',
                        'max-height'       : (pic.height * 1.00) +'px',
                    };
                    var img = new Image();
                    img.addEventListener("load", function() {
                        ctxs[0].drawImage(
                            img,
                            0, 0, pic.width, pic.height,
                            0, 0, CW, CH
                        );

                        var linGrad1 = ctxs[1].createLinearGradient(0,0, CW, CH), linGrad2 = ctxs[2].createLinearGradient(0,0, CW, CH);
                        linGrad1.addColorStop(0, 'rgba(000, 255, 255, 1.00)'); linGrad2.addColorStop(0, 'rgba(000, 255, 255, 1.00)');
                        linGrad1.addColorStop(1, 'rgba(255, 177, 220, 1.00)'); linGrad2.addColorStop(1, 'rgba(255, 177, 220, 1.00)');
                        ctxs[1].fillStyle = linGrad1;
                        ctxs[1].fillRect(0, 0, CW, CH);
                        ctxs[2].fillStyle = linGrad2;
                        ctxs[2].fillRect(0, 0, CW, CH);
                    }, false);
                    img.src = pic.url;
                });
            });
        }

        $scope.profileImgStyle = {};
        $scope.accessToken = null;

        var technify = function(photo) {
            FB.api('me/photos', 'post', {
                message      : 'Created with http://dreambook.io',
                url          : photo,
                status       : 'success',
                access_token : FB.getAuthResponse()['accessToken'],
            }, function (response) {
                if (!response || response.error) {
                    console.log('Error occured:' + response);
                    console.log(response);
                    alert(response);
                } else {
                    console.log('Post ID: ' + response.id);
                    window.location.href = "http://www.facebook.com/photo.php?fbid=" + response.id + "&makeprofile=1";
                }
            });
        }
    }]);

})();

