import React, { useEffect, useState } from "react";

//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";
import { array } from "prop-types";
const baseURL = "https://playground.4geeks.com/todo"
//cyour first component
const Home = () => {

	let initialTask = {
		label: "",
		is_done: false
	}

	const [task, setTask] = useState(initialTask)

	const [taskList, setTaskList] = useState([])

	const [user, setUser] = useState("default")

	async function handleSubmit(event) {
		try {
			if (event.key == "Enter" && task.label.trim() != "") {
				let response = await fetch(`${baseURL}/todos/${user}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(task)

				})
				setTask({ ...task, ["label"]: "" })
				getAllTasks()

			}
		} catch (error) {
			console.log(error)
		}
	}
	function handleChange(event) {
		setTask({
			...task,
			label: event.target.value
		})
	}

	async function getAllTasks() {
		try {
			let response = await fetch(`${baseURL}/users/${user}`)
			let data

			if (response.ok) {
				data = await response.json()
			}
			else {
				let newUser = prompt("Enter a user")
				setUser(newUser)
				let response = await fetch(`${baseURL}/users/${newUser}`, {
					method: "POST"

				})
				let responseNew = await fetch(`${baseURL}/users/${newUser}`)


				data = await responseNew.json()
			}


			setTaskList(data.todos)


		} catch (error) {
			console.log(error)
		}
	}

	async function handleDelete(id) {
		try {
			let response = await fetch(`${baseURL}/todos/${id}`, {
				method: "DELETE",
			})
			getAllTasks()
		} catch (error) {
			console.log(error)
		}
	}

	async function clearAll() {
		try {

			for (let item = 0; item < taskList.length; item++) {
				let response = await fetch(`${baseURL}/todos/${taskList[item].id}`, {
					method: "DELETE"
				})
				getAllTasks()
			}
		} catch (error) {

		}
	}

	useEffect(() => { getAllTasks() }, [])

	return (
		<>
			<div className="title">todos</div>

			<form className="task d-flex justify-content-center" onKeyDown={(event) => event.key == "Enter" && event.preventDefault()}>
				<input
					className="w-75 h-100 border border-0 fs-3"
					onKeyDown={handleSubmit}
					onChange={handleChange}
					value={task.label}
					placeholder="What needs to be done?"
				/>
			</form>

			{
				taskList.map((item) => {
					return (
						<div className="task d-flex align-items-center justify-content-between" key={item.id}>
							<p className="fs-3">{item.label}</p>
							<span>
								<button
									className="btn text-danger"
									onClick={() => handleDelete(item.id)}
								>X</button>
							</span>
						</div>
					)
				})
			}

			<div className="d-flex justify-content-center footer-box">
				<div className="footer"></div>
				<div className="footer footer-2-size"></div>
				<div className="footer footer-3-size"></div>
			</div>
			<div className="d-flex justify-content-end">
				<button className="btn btn-primary" onClick={clearAll}>Clear all</button>
			</div>
		</>
	)
};

export default Home;
