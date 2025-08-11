import React, { useEffect, useRef, useState } from "react";
import { createListService } from "services/listService";

type Side = "right" | "left";

interface AddListPopoverProps {
  boardId: number;
}

const AddListPopover: React.FC<AddListPopoverProps> = ({ boardId }) => {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [side, setSide] = useState<Side>("right");
  const [coords, setCoords] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const [name, setName] = useState("");
  const [insertSide, setInsertSide] = useState<Side>("right");

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const popRef = useRef<HTMLDivElement | null>(null);

  const positionPopover = () => {
    const btn = buttonRef.current;
    const pop = popRef.current;
    if (!btn || !pop) return;

    // Calcular la posición del popover
    pop.style.visibility = "hidden";
    pop.style.display = "block";
    const btnRect = btn.getBoundingClientRect();
    const popW = pop.offsetWidth;
    const screenW = window.innerWidth;
    const parentRect = btn.parentElement?.getBoundingClientRect();

    // Elegir el lado del popover
    let chosen: Side = "right";
    if (btnRect.right + popW > screenW && btnRect.left - popW >= 0)
      chosen = "left";

    // Lógica para position: absolute
    // Calcular la posición del popover
    const top = btnRect.top - (parentRect?.top || 0) + 30; // +30 de offset para que se baje un poco
    let left = 0;
    if (chosen === "right") {
      left = btnRect.right - (parentRect?.left || 0);
    } else {
      left = btnRect.left - (parentRect?.left || 0) - popW;
    }

    setSide(chosen);
    setCoords({ top, left });

    pop.style.display = "";
    pop.style.visibility = "";
    requestAnimationFrame(() => setVisible(true));
  };

  useEffect(() => {
    if (!open) {
      setVisible(false);
      return;
    }

    positionPopover();

    const onResize = () => {
      setVisible(false);
      positionPopover();
    };

    const onDocPointer = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        buttonRef.current?.contains(target) ||
        popRef.current?.contains(target)
      )
        return;
      setOpen(false);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("resize", onResize);
    document.addEventListener("pointerdown", onDocPointer);
    document.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("pointerdown", onDocPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const toggle = () => {
    if (open) {
      setOpen(false);
      setVisible(false);
    } else {
      setOpen(true);
    }
  };

  const handleAdd = async () => {
    if (!name.trim()) return;
    try {
      await createListService({
      name,
      side: insertSide,
      boardId: Number(boardId),
    });
      setName("");
      setInsertSide("right");
      setOpen(false);
      setVisible(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <button
        ref={buttonRef}
        onClick={toggle}
        className=""
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="44"
          height="44"
          viewBox="0 0 44 44"
          fill="none"
        >
          <rect width="44" height="44" rx="6" fill="black" />
          <path
            d="M12.666 22H31.3327"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M22 12.6667V31.3334"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          ref={popRef}
          style={{
            position: "absolute",
            top: coords.top,
            left: coords.left,
            zIndex: 9999,
            visibility: visible ? "visible" : "hidden",
            minWidth: 240,
          }}
          className="bg-[#000000] rounded-lg px-4 py-4"
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Escribe aqui..."
            className="w-full h-10 text-[15px] text-[#c4c4c4] placeholder-[#747171] bg-[#FFFFFF0A] border rounded-lg px-2 py-1 mb-3 outline-none border-[#3C3C3CB2]"
            autoFocus
          />

          <div className="flex flex-col gap-4 mb-3 text-sm">
            <input
              type="radio"
              id="insert-after"
              name="insertSide"
              value="right"
              checked={insertSide === "right"}
              onChange={() => setInsertSide("right")}
              className="sr-only"
            />
            <label
              className={`flex items-center gap-2 cursor-pointer  text-[#FFFFFF] p-2 rounded-lg ${
                insertSide === "right" && "bg-[#6A5FFF]"
              }`}
              htmlFor="insert-after"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
                viewBox="0 0 19 19"
                fill="none"
              >
                <path
                  d="M7.25 5L2.75 9.5L7.25 14"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.75 9.5H13.25"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.25 14.75V4.25"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Insertar lista después
            </label>

            <input
              type="radio"
              id="insert-before"
              name="insertSide"
              value="left"
              checked={insertSide === "left"}
              onChange={() => setInsertSide("left")}
              className="sr-only"
            />
            <label
              className={`flex items-center gap-2 cursor-pointer  text-[#FFFFFF] p-2 rounded-lg ${
                insertSide === "left" && "bg-[#6A5FFF]"
              }`}
              htmlFor="insert-before"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
                viewBox="0 0 19 19"
                fill="none"
              >
                <path
                  d="M2.75 4.25V14.75"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.25 9.5H5.75"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.75 14L16.25 9.5L11.75 5"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Insertar lista antes
            </label>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="flex-1 py-1 text-white rounded-lg bg-[#6A5FFF] hover:bg-[#5A4FEF]"
            >
              Agregar lista
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddListPopover;
