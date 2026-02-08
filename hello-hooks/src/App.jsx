import { useEffect, useMemo, useState } from "react";

function doSomething() {
    console.log("Function call");
    return "Some value";
}

export default function App() {
	const [count, setCount] = useState(0);

    useEffect(() => {
        console.log("Hello hooks");
    }, []);

    const value = useMemo(() => {
        return doSomething();
    }, []);

	return (
		<div>
			<h1>Hello Hook ({count})</h1>
			<button onClick={() => setCount(count + 1)}>Button</button>
		</div>
	);
}
