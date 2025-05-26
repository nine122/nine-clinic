import { ChevronLeft, ChevronRight } from "lucide-react";

const SlotDays = ({
  docSlots,
  slotIndex,
  setSlotIndex,
  daysOfWeek,
  scrollLeft,
  scrollRight,
  scrollRef,
  setSlotTime,
  slotTime,
  bookAppointment,
}) => {
  return (
    <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
      <p>Booking slots</p>
      <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
        {docSlots.map((item, index) => (
          <div
            className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
              slotIndex === index
                ? "bg-primary text-white"
                : "border border-gray-200"
            }`}
            key={index}
            onClick={() => setSlotIndex(index)}
          >
            <p>{daysOfWeek[item[0].dateTime.getDay()]}</p>
            <p>{item[0].dateTime.getDate()}</p>
          </div>
        ))}
      </div>

      {/* Time Slot Scrollable Section */}
      <div className="relative mt-4 p-5">
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 shadow rounded-full z-10"
        >
          <ChevronLeft size={20} />
        </button>

        <div
          ref={scrollRef}
          className="flex items-center gap-3 w-full overflow-x-auto no-scrollbar px-8"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {docSlots[slotIndex]?.map((item, index) => (
            <p
              key={index}
              className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                item.time === slotTime
                  ? "bg-primary text-white"
                  : "border border-gray-300"
              }`}
              onClick={() => setSlotTime(item.time)}
              style={{ scrollSnapAlign: "start" }}
            >
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>

        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 shadow rounded-full z-10"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <button
        onClick={bookAppointment}
        className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6"
      >
        Book an appointment
      </button>
    </div>
  );
};

export default SlotDays;
