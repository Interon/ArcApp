angular.module('app.mainPage')
   .controller('SurveyAppCtrl', ['$scope', '$state', '$ionicSideMenuDelegate', '$ionicModal', '$ionicHistory', '$timeout', 'FBREF','Application','UserService','Questions','Suggestions', function ($scope, $state, $ionicSideMenuDelegate, $ionicModal, $ionicHistory, $timeout, FBREF,Application,UserService,Questions,Suggestions ) {
        $scope.questions = Questions;

        $scope.suggestions = Suggestions;
        // add new items to the array
        // the message is automatically added to our Firebase database!
        $scope.addMessage = function() {
            $scope.suggestions.$add({
                text: $scope.newMessageText
            });
        };
        $scope.recordResponse = recordResponse;

        function recordResponse(question, answer) {

            // Special private property to prevent user from answering again
            question.$answered = true;

            // Increment the reslts
            question.results[answer]++;

            // Save the question.  NOTE : $answered will not be saved
            $scope.questions.$save(question);
        }



        Application.isUserLoggedIn();
        var cu = UserService.currentUser();
        // Public Properties
        $scope.loggedIn = false;
        $scope.loginData = {
            email: cu.userName ,
            password: cu.password
        };

        // Public Methods
        $scope.login = login;
        $scope.logout = logout;

        FBREF.onAuth(authDataCallback);

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        function authDataCallback(authData) {
            if (authData) {
                $scope.loggedIn = true;
                console.log("User " + authData.uid + " is logged in with " + authData.provider);
            } else {
                $scope.loggedIn = false;
                console.log("User is logged out");
            }
        }

        function login() {

            FBREF.authWithPassword($scope.loginData, function (err, authData) {
                if (err) {
                    console.log(err);
                    alert("Bad Email/Password");
                } else {
                    console.log("Auth data = ");
                    console.log(authData);

                    $scope.loginData = {
                        email: '',
                        password: ''
                    };

                    $scope.modal.hide();
                }
            });
        }

        function logout() {
            $ionicHistory.nextViewOptions({
                'disableBack': true,
                'historyRoot': true
            });

            FBREF.unauth();
            $ionicSideMenuDelegate.toggleLeft(false);
            $state.go('app.survey');
        }

    }]);
angular.module('app.mainPage')
    .controller('SurveyController', ['Questions','$scope', function (Questions,$scope) {
    console.log('SurveyController Entered')
        // Public Properties



    }]);
angular.module('app.mainPage')
    .controller('QuestionsController', ['$scope', '$timeout', '$ionicModal', '$ionicListDelegate', 'FBREF', function ($scope, $timeout, $ionicModal, $ionicListDelegate, FBREF) {


        // Public Properties
        $scope.questions = [];
        $scope.currentQuestion = null;
        $scope.currentQuestionKey = null;

        // Public Methods
        $scope.saveQuestion = saveQuestion;
        $scope.deleteQuestion = deleteQuestion;
        $scope.openQuestionEditor = openQuestionEditor;
        $scope.closeQuestionEditor = closeQuestionEditor;

        function attachQuestions(snapshot) {
            $timeout(function () {
                console.log("have new questions");
                $scope.questions = snapshot.val();
                console.log($scope.questions);
            });
        }

        $scope.$on('$ionicView.beforeEnter', function () {
            FBREF.child('questions').on("value", attachQuestions);
        });

        $scope.$on('$ionicView.beforeLeave', function () {
            FBREF.child('questions').off("value", attachQuestions);
        });

        function saveQuestion() {

            if ($scope.currentQuestionKey) {
                FBREF.child('questions').child($scope.currentQuestionKey).set($scope.currentQuestion);
            } else {
                FBREF.child('questions').push($scope.currentQuestion);
            }

            $scope.closeQuestionEditor();

        }

        function deleteQuestion(questionKey) {
            FBREF.child('questions').child(questionKey).set(null);
        }

        function openQuestionEditor(question, questionKey) {

            if (!question) {

                question = {
                    question: '',
                    results: {
                        'yes': 0,
                        'no': 0
                    }
                };

            }

            $scope.currentQuestion = question;
            $scope.currentQuestionKey = questionKey;

            $ionicModal.fromTemplateUrl('js/app/tripManagement/surveys/questionModal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(
                function (modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                }
            );
        }

        function closeQuestionEditor() {
            $scope.modal.hide();
            $scope.modal.remove();

            $ionicListDelegate.closeOptionButtons();
        }


    }]);




angular.module('app.mainPage')
    .controller('SuggestionspCtrl', ['$scope', '$state', '$ionicSideMenuDelegate', '$ionicModal', '$ionicHistory', '$timeout', 'FBREF','Application','UserService','Questions','Suggestions', function ($scope, $state, $ionicSideMenuDelegate, $ionicModal, $ionicHistory, $timeout, FBREF,Application,UserService,Questions,Suggestions ) {
        $scope.suggestions = Suggestions;
        $scope.addMessage = function() {
            FBREF.child('questions').push($scope.newMessageText);
        };

    }]);

angular.module('app.mainPage')
    .factory('Questions', ['$firebaseArray', 'FBREF', function ($firebaseArray, FBREF) {

        return $firebaseArray(FBREF.child('questions'));

    }]);
angular.module('app.mainPage')
    .factory('Suggestions', ['$firebaseArray', 'FBREF', function ($firebaseArray, FBREF) {

        return $firebaseArray(FBREF.child('Suggestions'));

    }]);