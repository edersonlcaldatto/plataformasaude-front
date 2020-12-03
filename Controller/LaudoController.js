var LaudoController = new (function () {
    let baseUrl = "https://api-plataformasaude.herokuapp.com//laudos";

    this.getLaudos = function () {
        $.get({
            type: "GET",
            url: baseUrl,
            success: function (result) {
                loadLaudos(result);
            },
            error: (xhr) => {
                alert(
                    "Erro ao buscar os Laudos: " +  xhr.status + " - " + xhr.statusText
                );
            },
        });
    };

    this.delete = function (event) {
        let idLaudo = event.target.parentNode.parentNode.querySelector(
            ".idLaudo"
        ).innerText;

        $.ajax({
            url: baseUrl + "/" + idLaudo,
            method: "DELETE",
            contentType: "application/json",
            success: function (result) {
                LaudoController.getLaudos();
            },
            error: function (request, msg, error) {
                alert("Erro ao deletar");
            },
        });
    };

    this.save = function () {
        var idLaudoToEdit = $("#idLaudo").val();

        if (idLaudoToEdit == null || idLaudoToEdit == "") {
            var laudo = this.getDadosLaudoModal();

            $.ajax({
                url: baseUrl,
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(laudo),
                success: function () {
                    $("#idLaudo").val("");
                    $("#cadastrarLaudo").modal("hide");
                    LaudoController.getLaudos();
                    LaudoController.limparDadosLaudoModal();
                },
                error: function (request, msg, error) {
                    $("#idLaudo").val("");
                    $("#cadastrarLaudo").modal("hide");
                    LaudoController.getLaudos();
                    LaudoController.limparDadosLaudoModal();
                },
            });
        } else {
            LaudoController.update(idLaudoToEdit);
        }
    };

    this.update = function (idLaudo) {
        var laudo = this.getDadosLaudoModal();

        $.ajax({
            url: baseUrl + "/" + idLaudo,
            method: "PUT",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(laudo),
            success: function (result) {
                $("#idLaudo").val("");
                $("#cadastrarLaudo").modal("hide");
                LaudoController.getLaudos();
                LaudoController.limparDadosLaudoModal();
            },
            error: function (request, msg, error) {
                $("#idLaudo").val("");
                $("#cadastrarLaudo").modal("hide");
                LaudoController.getLaudos();
                LaudoController.limparDadosLaudoModal();
            },
        });
    };

    this.edit = function (event) {
        getAtendimentosJson(loadAtendimentos);
        getMedicosJson(loadMedicos);
        let idLaudo = event.target.parentNode.parentNode.querySelector(".idLaudo").innerText;

        $("#idLaudo").val(idLaudo);

        $.get(baseUrl + "/" + idLaudo, function (data) {
            $("#cadastrarLaudo").modal("show");
            LaudoController.setDadosLaudoModal(data);
        });
    };

    this.setDadosLaudoModal = function (laudo) {
        $("#laudoTexto").val(laudo.texto);
        $("#laudoAtendimento").val(laudo.atendimento.nomeProcedimento);
        $("#laudoMedico").val(laudo.medico.nome);
    };

    this.limparDadosLaudoModal = function () {
        $("#laudoTexto").val("");
        $("#laudoAtendimento").val("");
        $("#laudoMedico").val("");
    };

    this.getDadosLaudoModal = function () {
        var laudo = {
            texto: $("#laudoTexto").val(),
            medico: getMedico(),
            atendimento: getAtendimento(),
        };
        console.log(laudo);

        return laudo;
    };

    function getAtendimento() {
        let valorCampo = $("#laudoAtendimento").val();
        let atendimentoDtList = document.getElementById("atendimentosDataList");

        for (i = 0; i <= atendimentoDtList.childNodes.length; i++) {
            option = atendimentoDtList.childNodes[i];
            if (option.value == valorCampo) {
                var codigoAtendimento = option.id;
                break;
            }
        }        
        return {
            idAtendimento: codigoAtendimento,
        };
    }

    function getMedico() {
        let valorCampo = $("#laudoMedico").val();
        let medicoDtList = document.getElementById("medicosDataList");

        for (i = 0; i <= medicoDtList.childNodes.length; i++) {
            option = medicoDtList.childNodes[i];
            if (option.value == valorCampo) {
                var codigoMedico = option.id;
                break;
            }
        }

        return {
            idMedico: codigoMedico,
        };
    }

    function loadLaudos(laudoJson) {
        $("#laudosTableBody").empty();

        for (i = 0; i <= laudoJson.length; i++) {
            adicionaLaudo(laudoJson[i]);
        }
    }

    function adicionaLaudo(laudo) {
        let laudoTr = montaTr(laudo);
        let tabela = document.getElementById("laudosTableBody");
        tabela.appendChild(laudoTr);
    }

    function montaTr(laudo) {
        let laudoTr = document.createElement("tr");
        laudoTr.classList.add("laudo");
        laudoTr.appendChild(montaTd(laudo.idLaudo, "idLaudo"));
        laudoTr.appendChild(montaTd(laudo.texto, "texto"));
        laudoTr.appendChild(montaTd(laudo.medico.nome, "medicoNome"));
        laudoTr.appendChild(
            montaTd(laudo.atendimento.nomeProcedimento, "laudoAtendimento")
        );

        let td = document.createElement("td");
        td.classList = "actions";

        let a = document.createElement("a");
        a.classList = "btn btn-warning btn-xs btn-sm";
        a.addEventListener("click", LaudoController.edit);
        a.innerText = "Editar";
        td.appendChild(a);

        let a1 = document.createElement("a");
        a1.classList = "btn btn-danger btn-xs btn-sm";
        a1.addEventListener("click", LaudoController.delete);
        a1.innerText = "Excluir";
        td.appendChild(a1);

        laudoTr.appendChild(td);

        return laudoTr;
    }

    function montaTd(dado, classe) {
        let td = document.createElement("td");
        td.textContent = dado;
        td.classList.add(classe);

        return td;
    }

    this.populaLookups = function () {
        getAtendimentosJson(loadAtendimentos);
        getMedicosJson(loadMedicos);
    };

    function loadAtendimentos(atendimentoList) {
        console.log(atendimentoList);
        let atendimentoDtList = document.getElementById("atendimentosDataList");

        while (atendimentoDtList.firstChild) {
            atendimentoDtList.removeChild(atendimentoDtList.firstChild);
        }

        for (i = 0; i <= atendimentoList.length; i++) {
            atendimentoDtList.appendChild(createOption(atendimentoList[i].idAtendimento, atendimentoList[i].nomeProcedimento));
        }
    }    

    function loadMedicos(medicosList) {
        let medicoDtList = document.getElementById("medicosDataList");

        while (medicoDtList.firstChild) {
            medicoDtList.removeChild(medicoDtList.firstChild);
        }

        for (i = 0; i <= medicosList.length; i++) {
            medicoDtList.appendChild(createOption(medicosList[i].idMedico, medicosList[i].nome));
        }
    }
})();

window.onload = LaudoController.getLaudos();
