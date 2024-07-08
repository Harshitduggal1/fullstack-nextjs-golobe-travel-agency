"use client";

import Image from "next/image";

import { Button } from "../ui/button";
import { DatePickerWithRange } from "../ui/DatePickerWithRange";
import { SearchAirportDropdown } from "@/components/SearchAirportDropdown";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { SelectTrip } from "../SelectTrip";
import { AddPromoCode } from "../AddPromoCode";

import { useState } from "react";

import { addDays } from "date-fns";
import { airports } from "@/data/airports";
import swap from "@/public/icons/swap.svg";

function SearchFlightsForm({ searchParams = {} }) {
  let searchParamsObj = {};
  if (Object.keys(searchParams).length > 0) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (key === "passenger") {
        searchParamsObj[key] = JSON.parse(value);
        continue;
      }
      searchParamsObj[key] = value;
    }
  } else {
    searchParamsObj = {
      from: "",
      to: "",
      departIataCode: "",
      arriveIataCode: "",
      depart: new Date().toISOString(),
      return: addDays(new Date(), 7).toISOString(),
      trip: "Economy",
      passenger: {
        adult: 1,
        children: 0,
      },
      class: "Economy",
      promocode: "",
    };
  }
  const [formData, setFormData] = useState(searchParamsObj);
  function handleSubmit(e) {
    e.preventDefault();
    const str = processSearchParams(new FormData(e.target));
    // const makeUrlSearchParams = new URLSearchParams(str).toString();
    e.target.submit();
  }

  function processSearchParams(paramObj) {
    const formObj = {};

    for (const [keys, value] of Object.entries(Object.fromEntries(paramObj))) {
      if (keys === "passenger") {
        formObj[keys] = JSON.parse(value);
        continue;
      }
      formObj[keys] = value;
    }

    return formObj;
  }
  function totalPassenger() {
    return Object.values(formData.passenger).reduce((a, b) => +a + +b, 0);
  }

  return (
    <form id="flightform" action="/flights/search" onSubmit={handleSubmit}>
      <input type="hidden" name="from" value={formData.from} />
      <input type="hidden" name="to" value={formData.to} />
      <input
        type="hidden"
        name="departIataCode"
        value={formData.departIataCode}
      />
      <input
        type="hidden"
        name="arriveIataCode"
        value={formData.arriveIataCode}
      />
      <input type="hidden" name="depart" value={formData.depart} />
      <input type="hidden" name="return" value={formData.return} />
      <input
        type="hidden"
        value={JSON.stringify(formData.passenger)}
        form="flightform"
        name="passenger"
      />
      <input
        type="hidden"
        value={formData.class}
        form="flightform"
        name="class"
      />

      <div className="my-[20px] grid gap-[24px] lg:grid-cols-2 xl:grid-cols-[2fr_1fr_repeat(2,_2fr)]">
        <div className="relative justify-between flex h-[48px] w-full items-center gap-[4px] rounded-[8px] border-2 border-primary">
          <span className="absolute -top-[8px] left-[16px] z-10 inline-block bg-white px-[4px] leading-none">
            From - to
          </span>

          <div className="h-full w-[45%]">
            <SearchAirportDropdown
              name={"from"}
              defaultValue={formData.from}
              airportsName={airports}
              className="h-full w-full text-start"
              getData={(value) => {
                setFormData({
                  ...formData,
                  from: value.city + ", " + value.country,
                  departIataCode: value.code,
                });
              }}
            />
          </div>
          <button
            onClick={() =>
              setFormData({ ...formData, from: formData.to, to: formData.from })
            }
            role={"button"}
            type={"button"}
            className="flex h-full items-center justify-center w-[10%] rounded-lg hover:bg-slate-400/20 transition-all transition-[duration:.4s]"
          >
            <Image
              alt=""
              className="min-h-[16px] min-w-[16px]"
              width={18}
              height={22}
              src={swap}
            />
          </button>

          <div className="h-full w-[45%]">
            <SearchAirportDropdown
              airportsName={airports}
              defaultValue={formData.to}
              className="h-full w-full text-start"
              name={"to"}
              getData={(value) => {
                setFormData({
                  ...formData,
                  to: value?.city + ", " + value?.country || "",
                  arriveIataCode: value?.code || "",
                });
              }}
            />
          </div>
        </div>

        <div className="relative rounded-[8px] border-2 border-primary">
          <span className="absolute -top-[8px] left-[16px] z-10 inline-block bg-white px-[4px] leading-none">
            Trip
          </span>
          <div className="h-full">
            <SelectTrip tripType={formData.trip} />
          </div>
        </div>
        <div
          className={
            "relative flex h-[48px] w-full items-center gap-[4px] rounded-[8px] border-2 border-primary"
          }
        >
          <span className="absolute -top-[8px] left-[16px] z-10 inline-block bg-white px-[4px] leading-none">
            Depart - Return
          </span>

          <DatePickerWithRange
            name={"depart&return"}
            className={"h-full w-full border-0"}
            getDate={(value) => {
              setFormData({
                ...formData,
                depart: value.from.toISOString(),
                return: value.to.toISOString(),
              });
            }}
          />
        </div>

        <div className="relative flex h-[48px] items-center gap-[4px] rounded-[8px] border-2 border-primary">
          <span className="absolute -top-[8px] left-[16px] z-10 inline-block bg-white px-[4px] leading-none">
            Passenger - Class
          </span>
          <Popover>
            <PopoverTrigger
              asChild
              className="h-full w-full justify-start rounded-lg"
            >
              <Button className="font-normal" variant={"ghost"}>
                {`${totalPassenger(formData.passenger)} ${
                  totalPassenger(formData.passenger) > 1 ? "people" : "person"
                }, ${formData.class}`}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Card className="p-3 bg-primary/30 border-primary border-2 mb-3">
                <CardHeader className="p-0 mb-4">
                  <CardTitle>Class</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="border-2 border-primary rounded-lg">
                    <SelectTrip
                      getValue={(value) =>
                        setFormData({ ...formData, class: value })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
              <Card className="p-3 bg-primary/30 border-primary border-2">
                <CardHeader className="p-0 mb-4">
                  <CardTitle>Passenger</CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex-col flex gap-3">
                  <Label>
                    Adult:
                    <Input
                      defaultValue={+formData.passenger.adult}
                      label="Adult"
                      type="number"
                      min={0}
                      max={10}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          passenger: {
                            ...formData.passenger,
                            adult: e.currentTarget.value,
                          },
                        });
                      }}
                    />
                  </Label>
                  <Label>
                    Children:
                    <Input
                      defaultValue={formData.passenger.children}
                      label="Children"
                      type="number"
                      min={0}
                      max={5}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          passenger: {
                            ...formData.passenger,
                            children: e.currentTarget.value,
                          },
                        });
                      }}
                    />
                  </Label>
                </CardContent>
              </Card>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex flex-wrap justify-end gap-[24px]">
        <AddPromoCode
          defaultCode={formData.promocode}
          getPromoCode={(promo) => {
            setFormData({ ...formData, promocode: promo });
          }}
        />
        <Button type="submit" className="gap-1">
          <Image
            width={24}
            height={24}
            src={"/icons/paper-plane-filled.svg"}
            alt={"paper_plane_icon"}
          />
          <span>Show Flights</span>
        </Button>
      </div>
    </form>
  );
}
// function SearchFlightsFormSmall({ className }) {
//   return (
//     <>
//       <div
//         className={
//           className + " grid grid-cols-flightsSmall items-center gap-24px"
//         }
//       >
//         <Select title={"From - To"} name={"fromto"} options={option} />
//         <Select title={"Trip"} name={"trip"} options={option} />
//         <Select
//           title={"Depart - Return"}
//           name={"departreturn"}
//           options={option}
//         />
//         <Select
//           title={"Passenger - Class"}
//           name={"passengerclass"}
//           options={option}
//         />
//         <Button
//           className={"min-w-max bg-mint-green"}
//           href="/find-flights/search"
//         >
//           <Image width={14} height={14} alt="" src={"/icons/search.svg"} />
//         </Button>
//       </div>
//     </>
//   );
// }

export { SearchFlightsForm /*SearchFlightsFormSmall*/ };
