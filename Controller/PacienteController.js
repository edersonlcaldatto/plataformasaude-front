var PacienteController = new function () {

	let baseUrl = "http://ec2-18-231-186-91.sa-east-1.compute.amazonaws.com:8080/pacientes";

	this.getPacientes = function () {
		$.get({
			type: 'GET',
			url: baseUrl,
			success: function (result) {
				loadPacientes(result)
			},
			error: (xhr) => {
				alert("Erro ao buscar as Pacientes: " + xhr.status + " - " + xhr.statusText)
			},
		});
	}

	this.delete = function (event) {
		let idPaciente = event.target.parentNode.parentNode.querySelector('.idPaciente').innerText;
		console.log("delete " + idPaciente);

		$.ajax({
			url: baseUrl + '/' + idPaciente,
			method: 'DELETE',
			contentType: 'application/json',
			success: function (result) {
				PacienteController.getPacientes();
			},
			error: function (request, msg, error) {
				alert('Erro ao deletar');
			}
		});
	}

	this.save = function () {
		var idPacienteToEdit = $("#idPaciente").val();

		if (idPacienteToEdit == null || idPacienteToEdit == "") {
			var paciente = this.getDadosPacienteModal();

			$.ajax({
				url: baseUrl,
				type: 'POST',
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				data: JSON.stringify(paciente),
				success: function () {
					$("#idPaciente").val("");
					$('#cadastrarPaciente').modal('hide');
					PacienteController.getPacientes();
					PacienteController.limparDadosPacienteModal();
				},
				error: function (request, msg, error) {
					$("#idPaciente").val("");
					$('#cadastrarPaciente').modal('hide');
					PacienteController.getPacientes();
					PacienteController.limparDadosPacienteModal();
				}
			});
		}
		else {
			PacienteController.update(idPacienteToEdit);
		}
	}

	this.update = function (idPaciente) {
		var paciente = this.getDadosPacienteModal();

		$.ajax({
			url: baseUrl + '/' + idPaciente,
			method: 'PUT',
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: JSON.stringify(paciente),
			success: function (result) {
				$("#idPaciente").val("");
				$('#cadastrarPaciente').modal('hide');
				PacienteController.getPacientes();
				PacienteController.limparDadosPacienteModal();
			},
			error: function (request, msg, error) {
				$("#idPaciente").val("");
				$('#cadastrarPaciente').modal('hide');
				PacienteController.getPacientes();
				PacienteController.limparDadosPacienteModal();
			}
		});
	}

	this.edit = function (event) {
		let idPaciente = event.target.parentNode.parentNode.querySelector('.idPaciente').innerText;

		$("#idPaciente").val(idPaciente);
		console.log(idPaciente);
		$.get(baseUrl + '/' + idPaciente, function (data) {
			$('#cadastrarPaciente').modal('show');
			PacienteController.setDadosPacienteModal(data);
		});
	}

	this.setDadosPacienteModal = function (paciente) {
		$('#pacienteEmpresa').val(paciente.empresa);
		$('#pacienteNome').val(paciente.nome);
		$('#pacienteNomeSocial').val(paciente.nomeSocial);
		$('#pacienteCpf').val(paciente.cpf);
		$('#pacientePassword').val(paciente.password);
		$('#pacienteRg').val(paciente.rg);
		$('#pacienteSexo').val(paciente.sexo);
	}

	this.limparDadosPacienteModal = function () {
		$('#pacienteEmpresa').val("");
		$('#pacienteNome').val("");
		$('#pacienteNomeSocial').val("");
		$('#pacienteCpf').val("");
		$('#pacientePassword').val("");
		$('#pacienteRg').val("");
		$('#pacienteSexo').val("");
	}

	this.getDadosPacienteModal = function () {
		var paciente = {
			empresa: $('#pacienteEmpresa').val(),
			nome: $('#pacienteNome').val(),
			nomeSocial: $('#pacienteNomeSocial').val(),
			cpf: $('#pacienteCpf').val(),
			password: $('#pacientePassword').val(),
			rg: $('#pacienteRg').val(),
			sexo: $('#pacienteRg').val()
		}

		return paciente;
	}

	function loadPacientes(pacientesJson) {

		$('#pacientesTableBody').empty();

		for (i = 0; i <= pacientesJson.length; i++) {
			adicionaPaciente(pacientesJson[i]);
		}
	}

	function adicionaPaciente(paciente) {
		let pacienteTr = montaTr(paciente);
		let tabela = document.getElementById("pacientesTableBody");
		tabela.appendChild(pacienteTr);
	}

	function montaTr(paciente) {
		let pacienteTr = document.createElement("tr");
		pacienteTr.classList.add("paciente");
		pacienteTr.appendChild(montaTd(paciente.idPaciente, "idPaciente"));
		pacienteTr.appendChild(montaTd(paciente.empresa, "empresa"));
		pacienteTr.appendChild(montaTd(paciente.nome, "nome"));
		pacienteTr.appendChild(montaTd(paciente.nomeSocial, "nomeSocial"));
		pacienteTr.appendChild(montaTd(paciente.cpf, "cpf"));
		pacienteTr.appendChild(montaTd(paciente.password, "password"));
		pacienteTr.appendChild(montaTd(paciente.rg, "rg"));
		pacienteTr.appendChild(montaTd(paciente.sexo, "sexo"));

		let td = document.createElement("td");
		td.classList = "actions";

		let a = document.createElement("a");
		a.classList = "btn btn-warning btn-xs btn-sm";
		a.addEventListener("click", PacienteController.edit);
		a.innerText = "Editar";
		td.appendChild(a);

		let a1 = document.createElement("a");
		a1.classList = "btn btn-danger btn-xs btn-sm";
		a1.addEventListener("click", PacienteController.delete);
		a1.innerText = "Excluir";
		td.appendChild(a1);

		pacienteTr.appendChild(td)

		return pacienteTr;
	}

	function montaTd(dado, classe) {
		let td = document.createElement("td");
		td.textContent = dado;
		td.classList.add(classe);

		return td;
	}


}

window.onload = PacienteController.getPacientes();