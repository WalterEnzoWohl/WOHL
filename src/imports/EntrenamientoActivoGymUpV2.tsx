import svgPaths from "./svg-es8kb496bd";
import imgProfileImage from "figma:asset/a51458e3245f947e773f797d56a984dc9acd6ee5.png";

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#adaaaa] text-[12px] tracking-[2.4px] uppercase w-[126.78px]">
        <p className="leading-[16px]">Sesión Actual</p>
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 1">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:ExtraBold_Italic',sans-serif] font-extrabold h-[80px] italic justify-center leading-[0] relative shrink-0 text-[36px] text-white tracking-[-0.9px] w-[134.08px]">
        <p className="leading-[40px] mb-0">Pecho y</p>
        <p className="leading-[40px]">Tríceps</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[134.08px]" data-name="Container">
      <Heading1 />
      <Heading />
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[12px] relative shrink-0 w-[13.5px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 12">
        <g id="Container">
          <path d={svgPaths.pbd14980} fill="var(--fill-0, #12EFD3)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex gap-[4px] items-center px-[12px] py-[4px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container3 />
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#12efd3] text-[14px] text-center w-[38.84px]">
        <p className="leading-[20px]">Notas</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Button />
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex items-end justify-between relative shrink-0 w-full" data-name="Container">
      <Container1 />
      <Container2 />
    </div>
  );
}

function Container5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#adaaaa] text-[10px] tracking-[1px] uppercase w-full">
          <p className="leading-[15px]">Volumen Total</p>
        </div>
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid leading-[0] relative size-full">
        <div className="-translate-y-1/2 absolute flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal h-[40px] justify-center left-0 text-[36px] text-white top-[20px] w-[120.03px]">
          <p className="leading-[40px]">12,450</p>
        </div>
        <div className="-translate-y-1/2 absolute flex flex-col font-['Plus_Jakarta_Sans:Bold_Italic',sans-serif] font-bold h-[20px] italic justify-center left-[124.03px] text-[#adaaaa] text-[14px] top-[28px] w-[17.09px]">
          <p className="leading-[20px]">kg</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundVerticalBorder() {
  return (
    <div className="bg-[#131313] col-1 h-[128px] justify-self-stretch relative rounded-[8px] row-1 shrink-0" data-name="Background+VerticalBorder">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start justify-between pl-[24px] pr-[20px] py-[20px] relative size-full">
          <Container5 />
          <Paragraph />
          <div className="absolute right-[-7.6px] size-[79.2px] top-[-7.6px]" data-name="Icon">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 79.2 79.2">
              <path d={svgPaths.p117f05c0} fill="var(--fill-0, white)" id="Icon" opacity="0.05" />
            </svg>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[rgba(18,239,211,0.4)] border-l-4 border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container6() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#adaaaa] text-[10px] tracking-[1px] uppercase w-full">
          <p className="leading-[15px]">Series Completas</p>
        </div>
      </div>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-baseline leading-[0] relative w-full">
        <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal h-[40px] justify-center relative shrink-0 text-[36px] text-white w-[38.06px]">
          <p className="leading-[40px]">14</p>
        </div>
        <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold_Italic',sans-serif] font-bold h-[20px] italic justify-center relative shrink-0 text-[#adaaaa] text-[14px] w-[27.33px]">
          <p className="leading-[20px]">/ 24</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundVerticalBorder1() {
  return (
    <div className="bg-[#131313] col-2 h-[128px] justify-self-stretch relative rounded-[8px] row-1 shrink-0" data-name="Background+VerticalBorder">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start justify-between pl-[24px] pr-[20px] py-[20px] relative size-full">
          <Container6 />
          <Paragraph1 />
          <div className="absolute h-[56px] right-[-4px] top-[4px] w-[72px]" data-name="Icon">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 72 56">
              <path d={svgPaths.p18e7d040} fill="var(--fill-0, white)" id="Icon" opacity="0.05" />
            </svg>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[rgba(127,152,255,0.4)] border-l-4 border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container4() {
  return (
    <div className="gap-x-[16px] gap-y-[16px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[_128px] relative shrink-0 w-full" data-name="Container">
      <BackgroundVerticalBorder />
      <BackgroundVerticalBorder1 />
    </div>
  );
}

function SectionWorkoutHeaderStatsBento() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Section - Workout Header & Stats Bento">
      <Container />
      <Container4 />
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[19.988px] relative shrink-0 w-[19.975px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.975 19.9878">
        <g id="Container">
          <path d={svgPaths.p3be95b00} fill="var(--fill-0, #12EFD3)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Overlay() {
  return (
    <div className="bg-[rgba(0,81,71,0.2)] content-stretch flex h-[48px] items-center justify-center relative rounded-[8px] shrink-0 w-[44.97px]" data-name="Overlay">
      <Container9 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold_Italic',sans-serif] font-bold h-[64px] italic justify-center leading-[0] relative shrink-0 text-[24px] text-white tracking-[-0.6px] uppercase w-[160.05px]">
        <p className="leading-[32px] mb-0">Bench Press</p>
        <p className="leading-[32px]">(Barra)</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#adaaaa] text-[12px] w-[136.63px]">
        <p className="leading-[16px]">Ejercicio 2 de 6 • Pecho</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[160.05px]" data-name="Container">
      <Heading2 />
      <Container11 />
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Container">
      <Overlay />
      <Container10 />
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[16px] relative shrink-0 w-[4px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 16">
        <g id="Container">
          <path d={svgPaths.p3caf0c80} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#262626] content-stretch flex flex-col items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container12 />
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container8 />
      <Button1 />
    </div>
  );
}

function Container13() {
  return (
    <div className="col-1 justify-self-stretch relative row-1 self-start shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative w-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#adaaaa] text-[10px] text-center tracking-[1px] uppercase w-[22.17px]">
          <p className="leading-[15px]">Set</p>
        </div>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="col-2 justify-self-stretch relative row-1 self-start shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative w-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#adaaaa] text-[10px] text-center tracking-[1px] uppercase w-[30.31px]">
          <p className="leading-[15px]">Prev</p>
        </div>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="col-3 justify-self-stretch relative row-1 self-start shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative w-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#12efd3] text-[10px] text-center tracking-[1px] uppercase w-[16.16px]">
          <p className="leading-[15px]">kg</p>
        </div>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="col-4 justify-self-stretch relative row-1 self-start shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative w-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#12efd3] text-[10px] text-center tracking-[1px] uppercase w-[29.55px]">
          <p className="leading-[15px]">Reps</p>
        </div>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="col-5 justify-self-stretch relative row-1 self-start shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative w-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#adaaaa] text-[10px] text-center tracking-[1px] uppercase w-[22.03px]">
          <p className="leading-[15px]">RPE</p>
        </div>
      </div>
    </div>
  );
}

function OverlayHorizontalBorder() {
  return (
    <div className="bg-[rgba(32,31,31,0.5)] relative shrink-0 w-full" data-name="Overlay+HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(73,72,71,0.1)] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid gap-x-[8px] gap-y-[8px] grid grid-cols-[repeat(6,minmax(0,1fr))] grid-rows-[_15px] pb-[13px] pt-[12px] px-[16px] relative w-full">
        <Container13 />
        <Container14 />
        <Container15 />
        <Container16 />
        <Container17 />
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="col-1 content-stretch flex flex-col items-center justify-self-stretch relative row-1 self-center shrink-0" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold_Italic',sans-serif] font-bold h-[24px] italic justify-center leading-[0] relative shrink-0 text-[#adaaaa] text-[16px] text-center w-[6.45px]">
        <p className="leading-[24px]">1</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="col-2 content-stretch flex flex-col items-center justify-self-stretch relative row-1 self-center shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[40px] justify-center leading-[0] not-italic relative shrink-0 text-[#adaaaa] text-[14px] text-center w-[30.7px]">
        <p className="leading-[20px] mb-0">80 ×</p>
        <p className="leading-[20px]">10</p>
      </div>
    </div>
  );
}

function Overlay1() {
  return (
    <div className="bg-[rgba(38,38,38,0.5)] col-3 content-stretch flex flex-col items-center justify-self-stretch py-[8px] relative rounded-[8px] row-1 self-center shrink-0" data-name="Overlay">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal h-[28px] justify-center leading-[0] relative shrink-0 text-[18px] text-center text-white w-[22.45px]">
        <p className="leading-[28px]">85</p>
      </div>
    </div>
  );
}

function Overlay2() {
  return (
    <div className="bg-[rgba(38,38,38,0.5)] col-4 content-stretch flex flex-col items-center justify-self-stretch py-[8px] relative rounded-[8px] row-1 self-center shrink-0" data-name="Overlay">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal h-[28px] justify-center leading-[0] relative shrink-0 text-[18px] text-center text-white w-[20px]">
        <p className="leading-[28px]">10</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="col-5 content-stretch flex flex-col items-center justify-self-stretch relative row-1 self-center shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#adaaaa] text-[12px] text-center w-[17.56px]">
        <p className="leading-[16px]">8.5</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="relative shrink-0 size-[15px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="Container">
          <path d={svgPaths.p3e48b80} fill="var(--fill-0, #12EFD3)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Overlay3() {
  return (
    <div className="bg-[rgba(18,239,211,0.2)] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[32px]" data-name="Overlay">
      <Container22 />
    </div>
  );
}

function Container21() {
  return (
    <div className="col-6 content-stretch flex h-[32px] items-start justify-center justify-self-stretch relative row-1 self-center shrink-0" data-name="Container">
      <Overlay3 />
    </div>
  );
}

function CompletedSet() {
  return (
    <div className="relative shrink-0 w-full" data-name="Completed Set">
      <div className="gap-x-[8px] gap-y-[8px] grid grid-cols-[repeat(6,minmax(0,1fr))] grid-rows-[_44px] px-[16px] py-[20px] relative w-full">
        <Container18 />
        <Container19 />
        <Overlay1 />
        <Overlay2 />
        <Container20 />
        <Container21 />
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="col-1 justify-self-stretch relative row-1 self-center shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative w-full">
        <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold_Italic',sans-serif] font-bold h-[28px] italic justify-center leading-[0] relative shrink-0 text-[#12efd3] text-[20px] text-center w-[12.33px]">
          <p className="leading-[28px]">2</p>
        </div>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="col-2 justify-self-stretch relative row-1 self-center shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative w-full">
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[40px] justify-center leading-[0] not-italic relative shrink-0 text-[#adaaaa] text-[14px] text-center w-[30.7px]">
          <p className="leading-[20px] mb-0">80 ×</p>
          <p className="leading-[20px]">10</p>
        </div>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex flex-col items-center overflow-clip relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] relative shrink-0 text-[#12efd3] text-[16px] text-center w-[19.95px]">
        <p className="leading-[24px]">85</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Container">
      <Container26 />
    </div>
  );
}

function RectangleAlignStretch() {
  return (
    <div className="content-stretch flex h-full items-start relative shrink-0" data-name="Rectangle:align-stretch">
      <div className="h-full min-w-[15px] opacity-0 shrink-0 w-[15px]" data-name="Rectangle" />
    </div>
  );
}

function Input() {
  return (
    <div className="relative shrink-0 w-full" data-name="Input">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip relative rounded-[inherit] w-full">
        <Container25 />
        <div className="flex flex-row items-center self-stretch">
          <RectangleAlignStretch />
        </div>
      </div>
    </div>
  );
}

function BackgroundBorderShadow() {
  return (
    <div className="bg-[#262626] col-3 justify-self-stretch relative rounded-[8px] row-1 self-center shrink-0" data-name="Background+Border+Shadow">
      <div aria-hidden="true" className="absolute border border-[rgba(18,239,211,0.3)] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_0px_10px_0px_rgba(18,239,211,0.1)]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-px py-[9px] relative w-full">
        <Input />
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-0 overflow-clip right-[15px] top-px" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal h-[21px] justify-center leading-[0] relative shrink-0 text-[#6b7280] text-[16px] text-center w-[9.61px]">
        <p className="leading-[normal]">-</p>
      </div>
    </div>
  );
}

function Container29() {
  return <div className="flex-[1_0_0] h-[24px] min-h-px min-w-px" data-name="Container" />;
}

function RectangleAlignStretch1() {
  return (
    <div className="content-stretch flex h-full items-start relative shrink-0" data-name="Rectangle:align-stretch">
      <div className="h-full min-w-[15px] opacity-0 shrink-0 w-[15px]" data-name="Rectangle" />
    </div>
  );
}

function Container28() {
  return (
    <div className="absolute content-stretch flex items-center left-0 right-0 top-0" data-name="Container">
      <Container29 />
      <div className="flex flex-row items-center self-stretch">
        <RectangleAlignStretch1 />
      </div>
    </div>
  );
}

function Input1() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Input">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <Container27 />
        <Container28 />
      </div>
    </div>
  );
}

function BackgroundBorderShadow1() {
  return (
    <div className="bg-[#262626] col-4 justify-self-stretch relative rounded-[8px] row-1 self-center shrink-0" data-name="Background+Border+Shadow">
      <div aria-hidden="true" className="absolute border border-[rgba(18,239,211,0.3)] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_0px_10px_0px_rgba(18,239,211,0.1)]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-px py-[9px] relative w-full">
        <Input1 />
      </div>
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#262626] col-5 justify-self-stretch relative rounded-[8px] row-1 self-center shrink-0" data-name="Background">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center py-[4px] relative w-full">
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#adaaaa] text-[12px] text-center w-[17.86px]">
          <p className="leading-[16px]">9.0</p>
        </div>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="h-[10.021px] relative shrink-0 w-[13.583px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5833 10.0208">
        <g id="Container">
          <path d={svgPaths.p127da640} fill="var(--fill-0, #003830)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#12efd3] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[40px]" data-name="Button">
      <Container31 />
    </div>
  );
}

function Container30() {
  return (
    <div className="col-6 h-[40px] justify-self-stretch relative row-1 self-center shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-center relative size-full">
        <Button2 />
      </div>
    </div>
  );
}

function ActiveSet() {
  return (
    <div className="bg-[rgba(18,239,211,0.05)] relative shrink-0 w-full" data-name="Active Set">
      <div aria-hidden="true" className="absolute border-[rgba(73,72,71,0.05)] border-l-4 border-solid border-t inset-0 pointer-events-none" />
      <div className="gap-x-[8px] gap-y-[8px] grid grid-cols-[repeat(6,minmax(0,1fr))] grid-rows-[_42px] pb-[20px] pl-[20px] pr-[16px] pt-[21px] relative w-full">
        <Container23 />
        <Container24 />
        <BackgroundBorderShadow />
        <BackgroundBorderShadow1 />
        <Background />
        <Container30 />
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="col-1 justify-self-stretch relative row-1 self-center shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative w-full">
        <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold_Italic',sans-serif] font-bold h-[24px] italic justify-center leading-[0] relative shrink-0 text-[#adaaaa] text-[16px] text-center w-[9.8px]">
          <p className="leading-[24px]">3</p>
        </div>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="col-2 justify-self-stretch relative row-1 self-center shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative w-full">
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[40px] justify-center leading-[0] not-italic relative shrink-0 text-[#adaaaa] text-[14px] text-center w-[30.7px]">
          <p className="leading-[20px] mb-0">80 ×</p>
          <p className="leading-[20px]">10</p>
        </div>
      </div>
    </div>
  );
}

function Overlay4() {
  return (
    <div className="bg-[rgba(38,38,38,0.5)] col-3 justify-self-stretch relative rounded-[8px] row-1 self-center shrink-0" data-name="Overlay">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center py-[8px] relative w-full">
        <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal h-[28px] justify-center leading-[0] relative shrink-0 text-[18px] text-center text-white w-[22.45px]">
          <p className="leading-[28px]">85</p>
        </div>
      </div>
    </div>
  );
}

function Overlay5() {
  return (
    <div className="bg-[rgba(38,38,38,0.5)] col-4 justify-self-stretch relative rounded-[8px] row-1 self-center shrink-0" data-name="Overlay">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center py-[8px] relative w-full">
        <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal h-[28px] justify-center leading-[0] relative shrink-0 text-[18px] text-center text-white w-[21.61px]">
          <p className="leading-[28px]">--</p>
        </div>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="col-5 justify-self-stretch relative row-1 self-center shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative w-full">
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#adaaaa] text-[12px] text-center w-[11.05px]">
          <p className="leading-[16px]">--</p>
        </div>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="relative shrink-0 size-[15px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="Container">
          <path d={svgPaths.p3c887f00} fill="var(--fill-0, #ADAAAA)" fillOpacity="0.5" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#262626] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[32px]" data-name="Background">
      <Container36 />
    </div>
  );
}

function Container35() {
  return (
    <div className="col-6 h-[32px] justify-self-stretch relative row-1 self-center shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-center relative size-full">
        <Background1 />
      </div>
    </div>
  );
}

function UpcomingSet() {
  return (
    <div className="opacity-40 relative shrink-0 w-full" data-name="Upcoming Set">
      <div aria-hidden="true" className="absolute border-[rgba(73,72,71,0.05)] border-solid border-t inset-0 pointer-events-none" />
      <div className="gap-x-[8px] gap-y-[8px] grid grid-cols-[repeat(6,minmax(0,1fr))] grid-rows-[_44px] pb-[20px] pt-[21px] px-[16px] relative w-full">
        <Container32 />
        <Container33 />
        <Overlay4 />
        <Overlay5 />
        <Container34 />
        <Container35 />
      </div>
    </div>
  );
}

function SetRows() {
  return (
    <div className="relative shrink-0 w-full" data-name="Set Rows">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <CompletedSet />
        <ActiveSet />
        <UpcomingSet />
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="relative shrink-0 size-[15px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="Container">
          <path d={svgPaths.p3a7f8c20} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#262626] content-stretch flex gap-[8px] items-center justify-center py-[19px] relative rounded-[8px] shrink-0 w-[147px]" data-name="Button">
      <Container37 />
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white w-[83.25px]">
        <p className="leading-[20px]">Añadir Serie</p>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="h-[9px] relative shrink-0 w-[9.75px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.75 9">
        <g id="Container">
          <path d={svgPaths.p15074000} fill="var(--fill-0, #12EFD3)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[rgba(0,81,71,0.2)] content-stretch flex gap-[36.64px] items-center justify-center pl-px pr-[29.66px] py-[13px] relative rounded-[8px] shrink-0 w-[149px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(18,239,211,0.2)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Container38 />
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[40px] justify-center leading-[0] not-italic relative shrink-0 text-[#12efd3] text-[14px] text-center w-[63.7px]">
        <p className="leading-[20px] mb-0">Siguiente</p>
        <p className="leading-[20px]">Ejercicio</p>
      </div>
    </div>
  );
}

function CardActions() {
  return (
    <div className="relative shrink-0 w-full" data-name="Card Actions">
      <div className="flex flex-row justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-start justify-center p-[16px] relative w-full">
          <Button3 />
          <Button4 />
        </div>
      </div>
    </div>
  );
}

function TableCard() {
  return (
    <div className="bg-[#131313] relative rounded-[8px] shrink-0 w-full" data-name="Table Card">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] w-full">
        <OverlayHorizontalBorder />
        <SetRows />
        <CardActions />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(73,72,71,0.1)] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_0px_15px_0px_rgba(18,239,211,0.15)]" />
    </div>
  );
}

function ActiveExerciseSection() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Active Exercise Section">
      <Container7 />
      <TableCard />
    </div>
  );
}

function Container41() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold_Italic',sans-serif] font-bold h-[20px] italic justify-center leading-[0] relative shrink-0 text-[14px] text-white w-[25.61px]">
        <p className="leading-[20px]">60s</p>
      </div>
    </div>
  );
}

function Svg() {
  return (
    <div className="h-[48px] relative w-[39.42px]" data-name="SVG">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 39.42 48">
        <g clipPath="url(#clip0_1_2037)" id="SVG">
          <path d={svgPaths.p2c40800} id="Vector" stroke="var(--stroke-0, #262626)" strokeWidth="2.99986" />
          <path d={svgPaths.p2c40800} id="Vector_2" stroke="var(--stroke-0, #12EFD3)" strokeWidth="2.99986" />
        </g>
        <defs>
          <clipPath id="clip0_1_2037">
            <rect fill="white" height="48" width="39.42" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container40() {
  return (
    <div className="content-stretch flex h-[48px] items-center justify-center relative shrink-0 w-[39.42px]" data-name="Container">
      <Container41 />
      <div className="absolute flex h-[39.42px] items-center justify-center left-[-4.29px] top-[4.29px] w-[48px]" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "21" } as React.CSSProperties}>
        <div className="-rotate-90 flex-none">
          <Svg />
        </div>
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 4">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#adaaaa] text-[12px] tracking-[1.2px] uppercase w-[132.33px]">
        <p className="leading-[16px]">Descanso Activo</p>
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold_Italic',sans-serif] font-bold h-[48px] italic justify-center leading-[0] relative shrink-0 text-[16px] text-white w-[165.16px]">
        <p className="leading-[24px] mb-0">Próxima Serie: Bench</p>
        <p className="leading-[24px]">Press</p>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[165.16px]" data-name="Container">
      <Heading3 />
      <Container43 />
    </div>
  );
}

function Container39() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative">
        <Container40 />
        <Container42 />
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-[rgba(18,239,211,0.1)] relative rounded-[8px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center px-[16px] py-[8px] relative">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#12efd3] text-[14px] text-center tracking-[-0.35px] uppercase w-[47.7px]">
          <p className="leading-[20px]">Omitir</p>
        </div>
      </div>
    </div>
  );
}

function DynamicRestPrompt() {
  return (
    <div className="backdrop-blur-[12px] bg-[rgba(19,19,19,0.9)] relative rounded-[8px] shrink-0 w-full" data-name="Dynamic Rest Prompt">
      <div aria-hidden="true" className="absolute border border-[rgba(18,239,211,0.2)] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_0px_15px_0px_rgba(18,239,211,0.15)]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[17px] relative w-full">
          <Container39 />
          <Button5 />
        </div>
      </div>
    </div>
  );
}

function Main() {
  return (
    <div className="max-w-[672px] relative shrink-0 w-full" data-name="Main">
      <div className="content-stretch flex flex-col gap-[32px] items-start max-w-[inherit] pb-[160px] pt-[96px] px-[24px] relative w-full">
        <SectionWorkoutHeaderStatsBento />
        <ActiveExerciseSection />
        <DynamicRestPrompt />
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Container">
          <path d={svgPaths.p56aff00} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function OverlayOverlayBlur() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(159,5,25,0.8)] content-stretch flex flex-[1_0_0] gap-[8px] h-[56px] items-center justify-center min-h-px min-w-px relative rounded-[8px]" data-name="Overlay+OverlayBlur">
      <div className="-translate-y-1/2 absolute bg-[rgba(255,255,255,0)] h-[56px] left-0 right-0 rounded-[8px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] top-1/2" data-name="Overlay+Shadow" />
      <Container45 />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:ExtraBold_Italic',sans-serif] font-extrabold h-[24px] italic justify-center leading-[0] relative shrink-0 text-[16px] text-center text-white tracking-[-0.8px] uppercase w-[204.28px]">
        <p className="leading-[24px]">Finalizar Entrenamiento</p>
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p4c2b800} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="backdrop-blur-[6px] bg-[#262626] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[56px]" data-name="Button">
      <div className="-translate-y-1/2 absolute bg-[rgba(255,255,255,0)] left-0 rounded-[8px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[56px] top-1/2" data-name="Button:shadow" />
      <Container46 />
    </div>
  );
}

function Container44() {
  return (
    <div className="content-stretch flex gap-[16px] items-center max-w-[672px] relative shrink-0 w-full" data-name="Container">
      <OverlayOverlayBlur />
      <Button6 />
    </div>
  );
}

function FloatingActionFooter() {
  return (
    <div className="absolute bg-gradient-to-t bottom-[96px] content-stretch flex flex-col from-[#0e0e0e] items-start left-0 p-[24px] right-0 to-[rgba(14,14,14,0)] via-1/2 via-[rgba(14,14,14,0.95)]" data-name="Floating Action Footer">
      <Container44 />
    </div>
  );
}

function Container48() {
  return (
    <div className="h-[28px] relative shrink-0 w-[34px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34 28">
        <g id="Container">
          <path d={svgPaths.p171558c0} fill="var(--fill-0, #12EFD3)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function GymUpLogo() {
  return <div className="shrink-0 size-[32px]" data-name="GymUp Logo" />;
}

function Heading4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 1">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:ExtraBold_Italic',sans-serif] font-extrabold h-[28px] italic justify-center leading-[0] relative shrink-0 text-[#12efd3] text-[20px] tracking-[-1px] uppercase w-[69.53px]">
        <p className="leading-[28px]">GYMUP</p>
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
      <GymUpLogo />
      <Heading4 />
    </div>
  );
}

function Container47() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative">
        <Container48 />
        <Container49 />
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="h-[12.25px] relative shrink-0 w-[10.5px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 12.25">
        <g id="Container">
          <path d={svgPaths.p1868f900} fill="var(--fill-0, #12EFD3)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container52() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#12efd3] text-[18px] tracking-[-0.4px] w-[45.66px]">
        <p className="leading-[28px]">42:15</p>
      </div>
    </div>
  );
}

function Background2() {
  return (
    <div className="bg-[#262626] content-stretch flex gap-[7.99px] items-center px-[12px] py-[4px] relative rounded-[8px] shrink-0" data-name="Background">
      <Container51 />
      <Container52 />
    </div>
  );
}

function ProfileImage() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="Profile image">
      <div className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgProfileImage} />
      </div>
    </div>
  );
}

function Border() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[32px]" data-name="Border">
      <div className="content-stretch flex flex-col items-start justify-center overflow-clip p-px relative rounded-[inherit] size-full">
        <ProfileImage />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(73,72,71,0.2)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container50() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative">
        <Background2 />
        <Border />
      </div>
    </div>
  );
}

function HeaderTopNavigationAnchor() {
  return (
    <div className="absolute bg-[#0e0e0e] content-stretch flex h-[64px] items-center justify-between left-0 pb-px px-[24px] top-0 w-[390px]" data-name="Header - Top Navigation Anchor">
      <div aria-hidden="true" className="absolute border-[rgba(73,72,71,0.1)] border-b border-solid inset-0 pointer-events-none" />
      <Container47 />
      <Container50 />
    </div>
  );
}

function Container53() {
  return (
    <div className="h-[18px] relative shrink-0 w-[16px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 18">
        <g id="Container">
          <path d={svgPaths.p12a32500} fill="var(--fill-0, #ADAAAA)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[4px] relative shrink-0" data-name="Margin">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] relative shrink-0 text-[#adaaaa] text-[10px] tracking-[1px] uppercase w-[38.31px]">
        <p className="leading-[15px]">Inicio</p>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="relative shrink-0" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center px-[24px] py-[8px] relative">
        <Container53 />
        <Margin />
      </div>
    </div>
  );
}

function Container54() {
  return (
    <div className="relative shrink-0 size-[19.8px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.8 19.8">
        <g id="Container">
          <path d={svgPaths.p2246b680} fill="var(--fill-0, #12EFD3)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin1() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[4px] relative shrink-0" data-name="Margin">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] relative shrink-0 text-[#12efd3] text-[10px] tracking-[1px] uppercase w-[105.33px]">
        <p className="leading-[15px]">Entrenamientos</p>
      </div>
    </div>
  );
}

function LinkActiveNavEntrenamientos() {
  return (
    <div className="bg-[rgba(0,81,71,0.2)] relative rounded-[8px] shadow-[0px_0px_15px_0px_rgba(18,239,211,0.1)] shrink-0" data-name="Link - Active Nav: Entrenamientos">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center px-[24px] py-[8px] relative">
        <Container54 />
        <Margin1 />
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Container">
          <path d={svgPaths.p85bff00} fill="var(--fill-0, #ADAAAA)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin2() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[4px] relative shrink-0" data-name="Margin">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] relative shrink-0 text-[#adaaaa] text-[10px] tracking-[1px] uppercase w-[39.13px]">
        <p className="leading-[15px]">Perfil</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="relative shrink-0" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center px-[24px] py-[8px] relative">
        <Container55 />
        <Margin2 />
      </div>
    </div>
  );
}

function BottomNavigationShell() {
  return (
    <div className="absolute backdrop-blur-[8px] bg-[rgba(19,19,19,0.8)] bottom-0 content-stretch flex gap-[10.4px] h-[96px] items-center left-0 pb-[24px] pl-[21.2px] pr-[21.21px] pt-px rounded-tl-[8px] rounded-tr-[8px] w-[390px]" data-name="Bottom Navigation Shell">
      <div aria-hidden="true" className="absolute border-[rgba(73,72,71,0.1)] border-solid border-t inset-0 pointer-events-none rounded-tl-[8px] rounded-tr-[8px] shadow-[0px_-8px_32px_0px_rgba(0,0,0,0.5)]" />
      <Link />
      <LinkActiveNavEntrenamientos />
      <Link1 />
    </div>
  );
}

export default function EntrenamientoActivoGymUpV() {
  return (
    <div className="bg-[#0e0e0e] content-stretch flex flex-col items-start pb-[4px] relative size-full" data-name="Entrenamiento Activo - GymUp (v2)">
      <Main />
      <FloatingActionFooter />
      <HeaderTopNavigationAnchor />
      <BottomNavigationShell />
    </div>
  );
}