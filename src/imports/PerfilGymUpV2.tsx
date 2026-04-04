import svgPaths from "./svg-y3g9i0hw58";
import imgCloseUpPortraitOfADeterminedMuscularMan from "figma:asset/e3098af6aff1b3ac1455a4c16edb432acdb322cd.png";

function Container1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#12efd3] text-[10px] tracking-[2px] uppercase w-full">
        <p className="leading-[15px]">Atleta Elite</p>
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 1">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[36px] text-white tracking-[-0.9px] w-full">
        <p className="leading-[40px]">Marcos Davila</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#adaaaa] text-[14px] w-full">
        <p className="leading-[20px]">Miembro desde Enero 2024</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Container">
      <Container1 />
      <Heading />
      <Container2 />
    </div>
  );
}

function SectionUserProfileHeader() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[16px] relative shrink-0 w-full" data-name="Section - User Profile Header">
      <Container />
      <div className="absolute right-[0.95px] size-[110.133px] top-[8.93px]" data-name="Icon">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 110.133 110.133">
          <path d={svgPaths.p33e2f400} fill="var(--fill-0, #12EFD3)" id="Icon" opacity="0.05" />
        </svg>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#adaaaa] text-[10px] tracking-[1px] uppercase w-full">
          <p className="leading-[15px]">Peso</p>
        </div>
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid leading-[0] relative size-full">
        <div className="-translate-y-1/2 absolute flex flex-col font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold h-[36px] justify-center left-0 text-[30px] text-white top-[18px] w-[38.86px]">
          <p className="leading-[36px]">84</p>
        </div>
        <div className="-translate-y-1/2 absolute flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[20px] justify-center left-[45.59px] text-[#12efd3] text-[14px] top-[24px] w-[17.08px]">
          <p className="leading-[20px]">kg</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-[#131313] col-[1/span_2] justify-self-stretch relative rounded-[8px] row-1 self-start shrink-0" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col items-start justify-between p-[21px] relative w-full">
        <Container3 />
        <Paragraph />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#adaaaa] text-[10px] tracking-[1px] uppercase w-full">
          <p className="leading-[15px]">Altura</p>
        </div>
      </div>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[56px] relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid leading-[0] relative size-full">
        <div className="-translate-y-1/2 absolute flex flex-col font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold h-[36px] justify-center left-0 text-[30px] text-white top-[18px] w-[49.27px]">
          <p className="leading-[36px]">182</p>
        </div>
        <div className="-translate-y-1/2 absolute flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[20px] justify-center left-[4px] text-[#12efd3] text-[14px] top-[46px] w-[21.45px]">
          <p className="leading-[20px]">cm</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="bg-[#131313] col-[3/span_2] justify-self-stretch relative rounded-[8px] row-1 self-start shrink-0" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col items-start justify-between p-[21px] relative w-full">
        <Container4 />
        <Paragraph1 />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#adaaaa] text-[10px] tracking-[1px] uppercase w-full">
          <p className="leading-[15px]">Edad</p>
        </div>
      </div>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="flex flex-col items-end size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end leading-[0] pr-[27.12px] relative w-full">
          <div className="flex flex-col font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold h-[36px] justify-center relative shrink-0 text-[30px] text-white w-[36.88px]">
            <p className="leading-[36px]">28</p>
          </div>
          <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[20px] justify-center relative shrink-0 text-[#12efd3] text-[14px] w-[32.75px]">
            <p className="leading-[20px]">años</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder2() {
  return (
    <div className="bg-[#131313] col-[5/span_2] justify-self-stretch relative rounded-[8px] row-1 self-start shrink-0" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col items-start justify-between p-[21px] relative w-full">
        <Container5 />
        <Paragraph2 />
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#adaaaa] text-[10px] tracking-[1px] uppercase w-full">
        <p className="leading-[15px]">Nivel</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[20px] relative shrink-0 w-[16px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 20">
        <g id="Container">
          <path d={svgPaths.p12df5c00} fill="var(--fill-0, #12EFD3)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[18px] text-white w-[86.16px]">
        <p className="leading-[28px]">Avanzado</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Container">
      <Container8 />
      <Container9 />
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#262626] col-[1/span_3] justify-self-stretch relative rounded-[8px] row-2 self-start shrink-0" data-name="Background">
      <div className="content-stretch flex flex-col gap-[8px] items-start pb-[22px] pt-[20px] px-[20px] relative w-full">
        <Container6 />
        <Container7 />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#12efd3] text-[10px] tracking-[1px] uppercase w-full">
          <p className="leading-[15px]">Objetivo</p>
        </div>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <div className="flex flex-col font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[18px] text-white w-full">
          <p className="leading-[28px]">Hipertrofia</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder3() {
  return (
    <div className="bg-[#005147] col-[4/span_3] justify-self-stretch relative rounded-[8px] row-2 self-start shrink-0" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[rgba(18,239,211,0.2)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[8px] items-start p-[21px] relative w-full">
        <Container10 />
        <Container11 />
      </div>
    </div>
  );
}

function SectionStatsGridBentoStyle() {
  return (
    <div className="gap-x-[12px] gap-y-[12px] grid grid-cols-[repeat(6,minmax(0,1fr))] grid-rows-[__113px_93px] relative shrink-0 w-full" data-name="Section - Stats Grid (Bento Style)">
      <BackgroundBorder />
      <BackgroundBorder1 />
      <BackgroundBorder2 />
      <Background />
      <BackgroundBorder3 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[24px] text-white tracking-[-0.6px] w-full">
        <p className="leading-[32px]">Progreso Mensual</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold h-[16px] justify-center leading-[0] relative shrink-0 text-[#adaaaa] text-[12px] tracking-[1.2px] uppercase w-[49.64px]">
        <p className="leading-[16px]">Pecho</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] relative shrink-0 text-[#12efd3] text-[16px] w-[43.31px]">
        <p className="leading-[24px]">Niv. 8</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex items-end justify-between relative shrink-0 w-full" data-name="Container">
      <Container14 />
      <Container15 />
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#262626] h-[8px] overflow-clip relative rounded-[9999px] shrink-0 w-full" data-name="Background">
      <div className="absolute inset-[0_20%_0_0] rounded-[9999px]" data-name="Gradient" style={{ backgroundImage: "linear-gradient(135deg, rgb(18, 239, 211) 0%, rgb(0, 168, 148) 100%)" }} />
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <Container13 />
      <Background1 />
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold h-[16px] justify-center leading-[0] relative shrink-0 text-[#adaaaa] text-[12px] tracking-[1.2px] uppercase w-[62.03px]">
        <p className="leading-[16px]">Espalda</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] relative shrink-0 text-[#12efd3] text-[16px] w-[42.16px]">
        <p className="leading-[24px]">Niv. 7</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex items-end justify-between relative shrink-0 w-full" data-name="Container">
      <Container18 />
      <Container19 />
    </div>
  );
}

function Background2() {
  return (
    <div className="bg-[#262626] h-[8px] overflow-clip relative rounded-[9999px] shrink-0 w-full" data-name="Background">
      <div className="absolute inset-[0_30%_0_0] rounded-[9999px]" data-name="Gradient" style={{ backgroundImage: "linear-gradient(135deg, rgb(18, 239, 211) 0%, rgb(0, 168, 148) 100%)" }} />
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <Container17 />
      <Background2 />
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold h-[16px] justify-center leading-[0] relative shrink-0 text-[#adaaaa] text-[12px] tracking-[1.2px] uppercase w-[59.3px]">
        <p className="leading-[16px]">Piernas</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] relative shrink-0 text-[#12efd3] text-[16px] w-[42.84px]">
        <p className="leading-[24px]">Niv. 9</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex items-end justify-between relative shrink-0 w-full" data-name="Container">
      <Container22 />
      <Container23 />
    </div>
  );
}

function Background3() {
  return (
    <div className="bg-[#262626] h-[8px] overflow-clip relative rounded-[9999px] shrink-0 w-full" data-name="Background">
      <div className="absolute inset-[0_10%_0_0] rounded-[9999px]" data-name="Gradient" style={{ backgroundImage: "linear-gradient(135deg, rgb(18, 239, 211) 0%, rgb(0, 168, 148) 100%)" }} />
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <Container21 />
      <Background3 />
    </div>
  );
}

function MuscleGroupBars() {
  return (
    <div className="relative shrink-0 w-full" data-name="Muscle Group Bars">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[20px] items-start relative w-full">
        <Container12 />
        <Container16 />
        <Container20 />
      </div>
    </div>
  );
}

function BackgroundBorder4() {
  return (
    <div className="bg-[#131313] relative rounded-[8px] shrink-0 w-full" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col items-start p-[25px] relative w-full">
        <MuscleGroupBars />
      </div>
    </div>
  );
}

function Section1ProgresoMensual() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Section 1: Progreso Mensual">
      <Heading1 />
      <BackgroundBorder4 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 2">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[32px] justify-center leading-[0] relative shrink-0 text-[24px] text-white tracking-[-0.6px] w-[228.67px]">
        <p className="leading-[32px]">Historial de Sesiones</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0" data-name="Button">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] relative shrink-0 text-[#12efd3] text-[10px] text-center tracking-[2px] uppercase w-[67.39px]">
        <p className="leading-[15px]">Ver Todo</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Heading2 />
      <Button />
    </div>
  );
}

function Container25() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] relative shrink-0 text-[#adaaaa] text-[10px] w-[19.83px]">
          <p className="leading-[15px]">LUN</p>
        </div>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold h-[28px] justify-center leading-[0] relative shrink-0 text-[18px] text-white w-[18.17px]">
          <p className="leading-[28px]">12</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundHorizontalBorder() {
  return (
    <div className="bg-[#262626] content-stretch flex flex-col h-[64px] items-center justify-center pt-[2px] relative rounded-[8px] shrink-0 w-[48px]" data-name="Background+HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[#12efd3] border-solid border-t-2 inset-0 pointer-events-none rounded-[8px]" />
      <Container25 />
      <Container26 />
    </div>
  );
}

function Container27() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] relative shrink-0 text-[#adaaaa] text-[10px] w-[22.67px]">
          <p className="leading-[15px]">MAR</p>
        </div>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold h-[28px] justify-center leading-[0] relative shrink-0 text-[18px] text-white w-[18.45px]">
          <p className="leading-[28px]">13</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder5() {
  return (
    <div className="bg-[#131313] content-stretch flex flex-col h-[64px] items-center justify-center p-px relative rounded-[8px] shrink-0 w-[48px]" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Container27 />
      <Container28 />
    </div>
  );
}

function Container29() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] relative shrink-0 text-[#adaaaa] text-[10px] w-[17.67px]">
          <p className="leading-[15px]">MIE</p>
        </div>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold h-[28px] justify-center leading-[0] relative shrink-0 text-[18px] text-white w-[19.36px]">
          <p className="leading-[28px]">14</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundHorizontalBorder1() {
  return (
    <div className="bg-[#262626] content-stretch flex flex-col h-[64px] items-center justify-center pt-[2px] relative rounded-[8px] shrink-0 w-[48px]" data-name="Background+HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[#12efd3] border-solid border-t-2 inset-0 pointer-events-none rounded-[8px]" />
      <Container29 />
      <Container30 />
    </div>
  );
}

function Container31() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] relative shrink-0 text-[#adaaaa] text-[10px] w-[17.06px]">
          <p className="leading-[15px]">JUE</p>
        </div>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold h-[28px] justify-center leading-[0] relative shrink-0 text-[18px] text-white w-[18.5px]">
          <p className="leading-[28px]">15</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder6() {
  return (
    <div className="bg-[#131313] content-stretch flex flex-col h-[64px] items-center justify-center p-px relative rounded-[8px] shrink-0 w-[48px]" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Container31 />
      <Container32 />
    </div>
  );
}

function Container33() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] relative shrink-0 text-[#adaaaa] text-[10px] w-[15.72px]">
          <p className="leading-[15px]">VIE</p>
        </div>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold h-[28px] justify-center leading-[0] relative shrink-0 text-[18px] text-white w-[18.14px]">
          <p className="leading-[28px]">16</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundHorizontalBorder2() {
  return (
    <div className="bg-[#262626] content-stretch flex flex-col h-[64px] items-center justify-center pt-[2px] relative rounded-[8px] shrink-0 w-[48px]" data-name="Background+HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[#12efd3] border-solid border-t-2 inset-0 pointer-events-none rounded-[8px]" />
      <Container33 />
      <Container34 />
    </div>
  );
}

function Container35() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] relative shrink-0 text-[#adaaaa] text-[10px] w-[20.44px]">
          <p className="leading-[15px]">SAB</p>
        </div>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold h-[28px] justify-center leading-[0] relative shrink-0 text-[18px] text-white w-[17.59px]">
          <p className="leading-[28px]">17</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder7() {
  return (
    <div className="bg-[#131313] content-stretch flex flex-col h-[64px] items-center justify-center p-px relative rounded-[8px] shrink-0 w-[48px]" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Container35 />
      <Container36 />
    </div>
  );
}

function CalendarStrip() {
  return (
    <div className="relative shrink-0 w-full" data-name="Calendar Strip">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-between pb-[8px] pr-[0.02px] relative w-full">
          <BackgroundHorizontalBorder />
          <BackgroundBorder5 />
          <BackgroundHorizontalBorder1 />
          <BackgroundBorder6 />
          <BackgroundHorizontalBorder2 />
          <BackgroundBorder7 />
        </div>
      </div>
    </div>
  );
}

function Container38() {
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

function Background4() {
  return (
    <div className="bg-[#262626] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[48px]" data-name="Background">
      <Container38 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[20px] justify-center leading-[0] relative shrink-0 text-[14px] text-white w-[126.2px]">
        <p className="leading-[20px]">Empuje (Push Day)</p>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal h-[15px] justify-center leading-[0] relative shrink-0 text-[#adaaaa] text-[10px] tracking-[0.5px] uppercase w-[106.22px]">
        <p className="leading-[15px]">14 de Mayo • 65 min</p>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[126.2px]" data-name="Container">
      <Heading3 />
      <Container40 />
    </div>
  );
}

function Container37() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative">
        <Background4 />
        <Container39 />
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold h-[24px] justify-center leading-[0] relative shrink-0 text-[#12efd3] text-[16px] w-[65.72px]">
          <p className="leading-[24px]">780 kcal</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder8() {
  return (
    <div className="bg-[#131313] relative rounded-[8px] shrink-0 w-full" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[17px] relative w-full">
          <Container37 />
          <Container41 />
        </div>
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="h-[21.5px] relative shrink-0 w-[16px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 21.5">
        <g id="Container">
          <path d={svgPaths.p2058000} fill="var(--fill-0, #12EFD3)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background5() {
  return (
    <div className="bg-[#262626] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[48px]" data-name="Background">
      <Container43 />
    </div>
  );
}

function Heading4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[20px] justify-center leading-[0] relative shrink-0 text-[14px] text-white w-[74.28px]">
        <p className="leading-[20px]">HIIT Cardio</p>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal h-[15px] justify-center leading-[0] relative shrink-0 text-[#adaaaa] text-[10px] tracking-[0.5px] uppercase w-[107.2px]">
        <p className="leading-[15px]">12 de Mayo • 30 min</p>
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[107.2px]" data-name="Container">
      <Heading4 />
      <Container45 />
    </div>
  );
}

function Container42() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative">
        <Background5 />
        <Container44 />
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold h-[24px] justify-center leading-[0] relative shrink-0 text-[#12efd3] text-[16px] w-[66.7px]">
          <p className="leading-[24px]">420 kcal</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder9() {
  return (
    <div className="bg-[#131313] relative rounded-[8px] shrink-0 w-full" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[17px] relative w-full">
          <Container42 />
          <Container46 />
        </div>
      </div>
    </div>
  );
}

function RecentSessionsList() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Recent Sessions List">
      <BackgroundBorder8 />
      <BackgroundBorder9 />
    </div>
  );
}

function Section2HistorialYEstadisticas() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Section 2: Historial y Estadísticas">
      <Container24 />
      <CalendarStrip />
      <RecentSessionsList />
    </div>
  );
}

function Heading5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 2">
      <div className="content-stretch flex flex-col items-start px-[4px] relative w-full">
        <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[18px] text-white tracking-[-0.45px] w-full">
          <p className="leading-[28px]">Configuración</p>
        </div>
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="h-[20px] relative shrink-0 w-[20.1px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.1 20">
        <g id="Container">
          <path d={svgPaths.p3cdadd00} fill="var(--fill-0, #12EFD3)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container49() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold h-[20px] justify-center leading-[0] relative shrink-0 text-[14px] text-center text-white w-[122.2px]">
        <p className="leading-[20px]">Ajustes de Cuenta</p>
      </div>
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

function Container50() {
  return (
    <div className="h-[12px] relative shrink-0 w-[7.4px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.4 12">
        <g id="Container">
          <path d={svgPaths.p28c84800} fill="var(--fill-0, #ADAAAA)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[21px] pt-[20px] px-[20px] relative w-full">
          <Container47 />
          <Container50 />
        </div>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="h-[20px] relative shrink-0 w-[16px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 20">
        <g id="Container">
          <path d={svgPaths.p164b49c0} fill="var(--fill-0, #ADAAAA)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container53() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] relative shrink-0 text-[14px] text-center text-white w-[97.73px]">
        <p className="leading-[20px]">Notificaciones</p>
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative">
        <Container52 />
        <Container53 />
      </div>
    </div>
  );
}

function Container54() {
  return (
    <div className="h-[12px] relative shrink-0 w-[7.4px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.4 12">
        <g id="Container">
          <path d={svgPaths.p28c84800} fill="var(--fill-0, #ADAAAA)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[21px] pt-[20px] px-[20px] relative w-full">
          <Container51 />
          <Container54 />
        </div>
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p3e9df400} fill="var(--fill-0, #FF716C)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container57() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold h-[20px] justify-center leading-[0] relative shrink-0 text-[#ff716c] text-[14px] text-center w-[90.66px]">
        <p className="leading-[20px]">Cerrar Sesión</p>
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Container">
      <Container56 />
      <Container57 />
    </div>
  );
}

function Button3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center p-[20px] relative w-full">
          <Container55 />
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder10() {
  return (
    <div className="bg-[#131313] relative rounded-[8px] shrink-0 w-full" data-name="Background+Border">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] w-full">
        <Button1 />
        <Button2 />
        <Button3 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function SectionSettingsQuickLinks() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start pt-[16px] relative shrink-0 w-full" data-name="Section - Settings Quick Links">
      <Heading5 />
      <BackgroundBorder10 />
    </div>
  );
}

function Main() {
  return (
    <div className="max-w-[672px] relative shrink-0 w-full" data-name="Main">
      <div className="content-stretch flex flex-col gap-[32px] items-start max-w-[inherit] px-[24px] relative w-full">
        <SectionUserProfileHeader />
        <SectionStatsGridBentoStyle />
        <Section1ProgresoMensual />
        <Section2HistorialYEstadisticas />
        <SectionSettingsQuickLinks />
      </div>
    </div>
  );
}

function Container59() {
  return (
    <div className="h-[12px] relative shrink-0 w-[18px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 12">
        <g id="Container">
          <path d={svgPaths.p2bce57c0} fill="var(--fill-0, #12EFD3)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container59 />
    </div>
  );
}

function GymUpLogo() {
  return <div className="shadow-[0px_0px_8px_0px_rgba(18,239,211,0.3)] shrink-0 size-[32px]" data-name="GymUp Logo" />;
}

function Container61() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:ExtraBold_Italic',sans-serif] font-extrabold h-[28px] italic justify-center leading-[0] relative shrink-0 text-[#12efd3] text-[20px] tracking-[-1px] w-[69.63px]">
        <p className="leading-[28px]">GYMUP</p>
      </div>
    </div>
  );
}

function Container60() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
      <GymUpLogo />
      <Container61 />
    </div>
  );
}

function Container58() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative">
        <Button4 />
        <Container60 />
      </div>
    </div>
  );
}

function CloseUpPortraitOfADeterminedMuscularMan() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="close-up portrait of a determined muscular man">
      <div className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgCloseUpPortraitOfADeterminedMuscularMan} />
      </div>
    </div>
  );
}

function OverlayBorderShadow() {
  return (
    <div className="bg-[rgba(255,255,255,0)] relative rounded-[8px] shrink-0 size-[40px]" data-name="Overlay+Border+Shadow">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center overflow-clip p-[2px] relative rounded-[inherit] size-full">
        <CloseUpPortraitOfADeterminedMuscularMan />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[rgba(18,239,211,0.5)] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_0px_0px_2px_rgba(18,239,211,0.1)]" />
    </div>
  );
}

function HeaderTopAppBar() {
  return (
    <div className="absolute backdrop-blur-[6px] bg-[rgba(14,14,14,0.9)] content-stretch flex h-[64px] items-center justify-between left-0 pb-px px-[24px] top-[-80px] w-[390px]" data-name="Header - TopAppBar">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-b border-solid inset-0 pointer-events-none" />
      <Container58 />
      <OverlayBorderShadow />
    </div>
  );
}

function Container62() {
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
        <Container62 />
        <Margin />
      </div>
    </div>
  );
}

function Container63() {
  return (
    <div className="relative shrink-0 size-[19.8px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.8 19.8">
        <g id="Container">
          <path d={svgPaths.p2246b680} fill="var(--fill-0, #ADAAAA)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin1() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[4px] relative shrink-0" data-name="Margin">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] relative shrink-0 text-[#adaaaa] text-[10px] tracking-[1px] uppercase w-[60.48px]">
        <p className="leading-[15px]">Entrenar</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="relative shrink-0" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center px-[24px] py-[8px] relative">
        <Container63 />
        <Margin1 />
      </div>
    </div>
  );
}

function Container64() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Container">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Container">
          <path d={svgPaths.p301d5280} fill="var(--fill-0, #12EFD3)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin2() {
  return (
    <div className="relative shrink-0" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[4px] relative">
        <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] relative shrink-0 text-[#12efd3] text-[10px] tracking-[1px] uppercase w-[39.13px]">
          <p className="leading-[15px]">Perfil</p>
        </div>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="bg-[rgba(18,239,211,0.1)] relative rounded-[8px] shrink-0" data-name="Link">
      <div aria-hidden="true" className="absolute border border-[rgba(18,239,211,0.2)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center px-[25px] py-[9px] relative">
        <Container64 />
        <Margin2 />
      </div>
    </div>
  );
}

function BottomNavBar() {
  return (
    <div className="absolute backdrop-blur-[12px] bg-[rgba(14,14,14,0.8)] bottom-0 content-stretch flex gap-[24.7px] h-[96px] items-center left-0 pb-[24px] pl-[28.34px] pr-[28.35px] pt-px w-[390px]" data-name="BottomNavBar">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-solid border-t inset-0 pointer-events-none" />
      <Link />
      <Link1 />
      <Link2 />
    </div>
  );
}

export default function PerfilGymUpV() {
  return (
    <div className="bg-[#0e0e0e] content-stretch flex flex-col items-start pb-[132px] relative size-full" data-name="Perfil - GymUp (v2)">
      <Main />
      <HeaderTopAppBar />
      <BottomNavBar />
    </div>
  );
}