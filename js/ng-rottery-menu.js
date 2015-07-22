var module = angular.module('ngRotteryMenu',[]);


var degree = '+=0';
var wheelTween;
var mouseWheel = 0;
var lastY;
var type = "vertical";
var updateTween = function(degree,direction) {
    if (type == 'vertical'){
        wheelTween = TweenMax.to(".rotteryMenu", 0.3, {
            rotation: "0",
            rotationX: degree + direction,
            rotationY: "0",
            x:"0%"
        });
    } else {
        wheelTween = TweenMax.to(".rotteryMenu", 0.3, {
            rotation: "0",
            rotationX: "0",
            rotationY: degree + direction,
            x:"-50%"
        });
    }
};
module.directive("scrollMenu3dWheel", function ($compile) {

    return {

        controller: function($scope, $element , $timeout) {

            $scope.hideHeader = false;



            $scope._onWheel = function(delta) {
                var direction = "_cw";

                if(wheelTween){
                    wheelTween.kill();
                }
                if(delta >0){
                    //up

                    degree = '+='+ delta/2;
                    direction = "_cw";
                }else {
                    //down
                    degree = '+='+ delta/2;
                    direction = "_ccw";
                }

                if(degree > 360){
                    degree = 0;
                }else if (degree < 0){
                    degree = 360;
                }

                updateTween(degree,direction);
                $scope.degree = degree;
                $scope.currentMenu = Math.floor( (degree / 24) % 14 );
                $scope.$apply()
            };

            $scope._onDrag = function(e){
                if(wheelTween){
                    wheelTween.kill();
                }
                var direction = "_cw";
                var currentY = e.touches[0].clientY;
                if(currentY > lastY){
                    // moved down
                    degree = '-=30';
                    direction = "_ccw";
                }else if(currentY < lastY){
                    // moved up
                    degree = '+=30';
                    direction = "_cw";
                }

                if(degree > 360){
                    degree = 0;
                }else if (degree < 0){
                    degree = 360;
                }
                updateTween(degree,direction);
                lastY = currentY;
                $scope.$apply();


            }
            //If you want old fashion mouseWheel event listener
            //$element[0].addEventListener('DOMMouseScroll',$scope. _onWheel, false ); // For FF and Opera
            //$element[0].addEventListener('mousewheel', $scope._onWheel, false ); // For others
            //for mobile but i suggest modernizr because it work weird on mobile
            document.addEventListener("touchmove", $scope._onDrag, false);

            Hamster($element[0]).wheel(function(event, delta, deltaX, deltaY){
                event.preventDefault();
                    if (type == 'vertical'){
                        $scope. _onWheel(deltaY);
                    }else{
                        $scope. _onWheel(deltaX);
                    }

            });

        },
        restrict:"A",
        link:function($scope,$elem,$attr){
            $scope.$watch(function(){

                $elem.removeClass('vertical');
                $elem.removeClass('horizontal');
                if ($attr.type == 'vertical' || $attr.type == 'horizontal' ){
                    type = $attr.type;
                    $elem.addClass(type);
                }else{
                    type = 'vertical';
                    console.log("rotteryUnknownType")
                }
                updateTween(degree,type);
            });


        }


    }
});
