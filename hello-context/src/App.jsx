import { useState, useContext, createContext } from "react"

const AppContext = createContext();

function Title() {
    const count = useContext(AppContext);

    return <h1>Hello Context ({count})</h1>
}

function Header() {
    return <div>
        <Title />
    </div>
}

export default function App() {
    const [count, setCount] = useState(0);

    return (
		<AppContext.Provider value={count}>
			<Header />
			<p>
				<button onClick={() => setCount(count + 1)}>Button</button>
			</p>
			<p>{count}</p>
		</AppContext.Provider>
	);
}