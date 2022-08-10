import axios from "axios";
import { MouseEvent, useCallback, useEffect, useReducer } from "react";
import { User } from "./types/users";

import "./App.scss";
const ACTIONS = {
	REQUEST: "request",
	ERROR: "error",
	SUCCESS: "SUCCESS",
	REMOVE: "REMOVE",
	ADD: "ADD",
};

const stateInit = {
	success: "success",
	error: "error",
	data: {},
	loading: false,
};

const reducer = (state: any, action: any) => {
	switch (action.type) {
		case ACTIONS.REQUEST: {
			return { ...state, loading: true };
		}
		case ACTIONS.SUCCESS: {
			return { ...state, loading: false, data: action.payload };
		}
		case ACTIONS.ERROR: {
			return { ...state, loading: false, error: action.error };
		}

		case ACTIONS.REMOVE: {
			return {
				...state,
				loading: false,
				data: action.payload.filter((item: User) => item.sid !== action.id),
			};
		}
	}
};

function App() {
	const [state, dispatch] = useReducer(reducer, stateInit);

	const fetchData = useCallback(async () => {
		await axios
			.get("http://localhost:3001/results")
			.then(function (response) {
				dispatch({ type: ACTIONS.SUCCESS, payload: response.data });
			})
			.catch(function (error) {
				dispatch({ type: ACTIONS.ERROR, error: error });
			});
	}, []);

	const removeItem = (
		e: MouseEvent<HTMLButtonElement>,
		id: number,
		data: any
	) => {
		dispatch({ type: ACTIONS.REMOVE, payload: data, id: id });
	};

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return (
		<div className="App">
			<div className="container">
				<div className="row">
					<div className="col-3"></div>
					<div className="col-8">
						<div className="users-list-cell">
							{state &&
								state.data &&
								state?.data?.length > 1 &&
								state?.data?.map((item: User) => {
									return (
										<div className="toast show" key={item.sid}>
											<article className="article">
												<button
													type="button"
													className="btn-close btn-close--position"
													onClick={(e) => removeItem(e, item.sid, state.data)}
												>
													<span></span>
												</button>
												<div className="article-left">
													<img src={item.picture?.large} alt="" title="" width="128" />
												</div>

												<div className="article-right">
													<h2 className="main-title">
														{item.name?.title} {item.name?.first} {item.name?.last}
													</h2>

													<div className="article-right">
														<div className="article-right-cell">
															<p>gender - {item.gender}</p>
															<p>age - {item.dob?.age}</p>
															<p>email - {item.email}</p>
														</div>

														<div className="article-right-cell">
															<p>country - {item.location?.country}</p>
															<p>city - {item.location?.city} </p>
															<p>state - {item.location?.state} </p>
														</div>

														<div className="article-right-cell">
															<p>timezone - {item.location?.timezone?.offset}</p>
														</div>
													</div>
												</div>
											</article>
										</div>
									);
								})}
						</div>

						<div className="input-group input-group--top-spacer-1">
							<input
								type="text"
								className="form-control"
								placeholder="Last Name, First Name"
							/>
							<button className="btn btn-primary" type="button" id="button-addon2">
								Submit
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
