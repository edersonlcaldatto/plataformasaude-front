const baseUrl = "https://api-plataformasaude.herokuapp.com";

function getMedicosJson(callback) {
  $.get({
    type: "GET",
    url: baseUrl + "/medicos",
    success: function (result) {
      console.log(result);
      return callback(result);
    },
    error: (xhr) => {
      alert(
        "Erro ao buscar as médicos: " + xhr.status + " - " + xhr.statusText
      );
    },
  });
}

function getPacientesJson(callback) {
    $.get({
      type: "GET",
      url: baseUrl + "/pacientes",
      success: function (result) {
        console.log(result);
        return callback(result);
      },
      error: (xhr) => {
        alert(
          "Erro ao buscar as pacientes: " + xhr.status + " - " + xhr.statusText
        );
      },
    });
  }

  function getAtendimentosJson(callback) {
    $.get({
      type: "GET",
      url: baseUrl + "/atendimentos",
      success: function (result) {
        console.log(result);
        return callback(result);
      },
      error: (xhr) => {
        alert(
          "Erro ao buscar as Atendimentos: " + xhr.status + " - " + xhr.statusText
        );
      },
    });
  }


  function createOption(id, value){
    let option = document.createElement("option");
    option.id = id;
    option.value = value;
    return option;
  }