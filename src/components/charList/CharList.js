import { useState, useEffect, useRef, useMemo } from "react";
import PropTypes from "prop-types";

import useMarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import "./charList.scss";

//rendering the right parts of the interface depending on the process
const setContent = (process, Component, newItemLoading) => {
    switch (process) {
        case "waiting":
            return <Spinner />;
        case "loading":
            return newItemLoading ? <Component /> : <Spinner />;
        case "confirmed":
            return <Component />;
        case "error":
            return <ErrorMessage />;
        default:
            throw new Error("Unexpected process state");
    }
};

const CharList = (props) => {
    const [chars, setChars] = useState([]),
        [newItemLoading, setNewItemLoading] = useState(false),
        [offset, setOffset] = useState(190),
        [charEnded, setCharEnded] = useState(false);

    const { getAllCharacters, process, setProcess } = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
        // eslint-disable-next-line
    }, []);

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharsLoaded)
            .then(() => setProcess("confirmed"));
    };

    const onCharsLoaded = (newChars) => {
        let ended = false;
        if (newChars.length < 9) {
            ended = true;
        }

        setChars((chars) => [...chars, ...newChars]);
        setNewItemLoading((setNewItemLoading) => false);
        setOffset((offset) => offset + 9);
        setCharEnded((charEnded) => ended);
    };

    //sets active card using refs
    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach((item) => item.classList.remove("char__item_selected"));
        itemRefs.current[id].classList.add("char__item_selected");
        itemRefs.current[id].focus();
    };

    //method for optimization
    function renderItems(arr) {
        const items = arr.map((item, i) => {
            let imgStyle = { objectFit: "cover" };

            //choosing an image style for a placeholder image
            if (item.thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg") {
                imgStyle = { objectFit: "unset" };
            }

            return (
                <li
                    key={i}
                    className="char__item"
                    tabIndex={0}
                    ref={(el) => (itemRefs.current[i] = el)}
                    onClick={() => {
                        props.onCharSelected(item.id);
                        focusOnItem(i);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === " " || e.key === "Enter") {
                            props.onCharSelected(item.id);
                            focusOnItem(i);
                        }
                    }}
                >
                    <img src={item.thumbnail} alt={item.name} style={imgStyle} />
                    <div className="char__name">{item.name}</div>
                </li>
            );
        });

        //centring spinner & error message
        return <ul className="char__grid">{items}</ul>;
    }

    //re-rendering of the CharList component only happens when the 'process' state changes
    const elements = useMemo(() => {
        return setContent(process, () => renderItems(chars), newItemLoading);
        // eslint-disable-next-line
    }, [process]);

    return (
        <div className="char__list">
            {elements}
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                onClick={() => onRequest(offset)}
                style={{ display: charEnded ? "none" : "block" }}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    );
};

//type checking
CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
