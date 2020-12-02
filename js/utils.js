function getMedicosJson(callback) {
  $.get({
    type: "GET",
    url: "http://ec2-18-231-186-91.sa-east-1.compute.amazonaws.com:8080/medicos",
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
      url: "http://ec2-18-231-186-91.sa-east-1.compute.amazonaws.com:8080/pacientes",
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
      url: "http://ec2-18-231-186-91.sa-east-1.compute.amazonaws.com:8080/atendimentos",
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