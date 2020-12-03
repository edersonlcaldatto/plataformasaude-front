var MedicoController = new function () {

	let baseUrl = "https://api-plataformasaude.herokuapp.com//medicos";

	this.getMedicos = function () {
		$.get({
			type: 'GET',
			url: baseUrl,
			success: function (result) {
				loadMedicos(result)
			},
			error: (xhr) => {
				alert("Erro ao buscar as pessoas: " + xhr.status + " - " + xhr.statusText)
			},
		});
	}

	this.delete = function (event) {
		let idMedico = event.target.parentNode.parentNode.querySelector('.idMedico').innerText;
		console.log("delete " + idMedico);

		$.ajax({
			url: baseUrl + '/' + idMedico,
			method: 'DELETE',
			contentType: 'application/json',
			success: function (result) {
				MedicoController.getMedicos();
			},
			error: function (request, msg, error) {
				alert('Erro ao deletar');
			}
		});
	}

	this.save = function () {
		var idMedicoToEdit = $("#idMedico").val();

		if (idMedicoToEdit == null || idMedicoToEdit == "") {
			var medico = this.getDadosMedicoModal();

			$.ajax({
				url: baseUrl,
				type: 'POST',
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				data: JSON.stringify(medico),
				success: function () {
					$("#idMedico").val("");
					$('#cadastrarMedico').modal('hide');
					MedicoController.getMedicos();
					MedicoController.limparDadosMedicoModal();
				},
				error: function (request, msg, error) {
					$("#idMedico").val("");
					$('#cadastrarMedico').modal('hide');
					MedicoController.getMedicos();
					MedicoController.limparDadosMedicoModal();
				}
			});
		}
		else {
			MedicoController.update(idMedicoToEdit);
		}
	}

	this.update = function (idMedico) {
		var medico = this.getDadosMedicoModal();

		$.ajax({
			url: baseUrl + '/' + idMedico,
			method: 'PUT',
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: JSON.stringify(medico),
			success: function (result) {
				$("#idMedico").val("");
				$('#cadastrarMedico').modal('hide');
				MedicoController.getMedicos();
				MedicoController.limparDadosMedicoModal();
			},
			error: function (request, msg, error) {
				$("#idMedico").val("");
				$('#cadastrarMedico').modal('hide');
				MedicoController.getMedicos();
				MedicoController.limparDadosMedicoModal();
			}
		});
	}

	this.edit = function (event) {
		let idMedico = event.target.parentNode.parentNode.querySelector('.idMedico').innerText;

		$("#idMedico").val(idMedico);
		console.log(idMedico);
		$.get(baseUrl + '/' + idMedico, function (data) {
			$('#cadastrarMedico').modal('show');
			MedicoController.setDadosMedicoModal(data);
		});
	}

	this.setDadosMedicoModal = function (medico) {
		$('#medicoNome').val(medico.nome);
		$('#medicoCrm').val(medico.crm);
		$('#medicoUf').val(medico.uf);
	}

	this.limparDadosMedicoModal = function () {
		$('#medicoNome').val("");
		$('#medicoCrm').val("");
		$('#medicoUf').val("");

	}

	this.getDadosMedicoModal = function () {
		var medico = {
			nome: $('#medicoNome').val(),
			crm: $('#medicoCrm').val(),
			uf: $('#medicoUf').val()
		}

		return medico;
	}

	function loadMedicos(medicoJson) {

		$('#medicosTableBody').empty();

		for (i = 0; i <= medicoJson.length; i++) {
			adicionaMedico(medicoJson[i]);
		}
	}

	function adicionaMedico(medico) {
		let medicoTr = montaTr(medico);
		let tabela = document.getElementById("medicosTableBody");
		tabela.appendChild(medicoTr);
	}

	function montaTr(medico) {
		let medicoTr = document.createElement("tr");
		medicoTr.classList.add("medico");
		medicoTr.appendChild(montaTd(medico.idMedico, "idMedico"));
		medicoTr.appendChild(montaTd(medico.nome, "nome"));
		medicoTr.appendChild(montaTd(medico.crm, "crm"));
		medicoTr.appendChild(montaTd(medico.uf, "uf"));

		let td = document.createElement("td");
		td.classList = "actions";

		let a = document.createElement("a");
		a.classList = "btn btn-warning btn-xs btn-sm";
		a.addEventListener("click", MedicoController.edit);
		a.innerText = "Editar";
		td.appendChild(a);

		let a1 = document.createElement("a");
		a1.classList = "btn btn-danger btn-xs btn-sm";
		a1.addEventListener("click", MedicoController.delete);
		a1.innerText = "Excluir";
		td.appendChild(a1);

		medicoTr.appendChild(td)

		return medicoTr;
	}

	function montaTd(dado, classe) {
		let td = document.createElement("td");
		td.textContent = dado;
		td.classList.add(classe);

		return td;
	}


}

window.onload = MedicoController.getMedicos();