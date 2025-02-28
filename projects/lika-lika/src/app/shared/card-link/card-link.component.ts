import {ChangeDetectionStrategy, Component, Input, OnInit} from "@angular/core";
import {UntilDestroy} from "@ngneat/until-destroy";
import {SubjectArea} from "../../subject-area/api/subject-area";
import {IImage} from "@media/image";
import {RouterLink} from "@angular/router";
import {NgClass} from "@angular/common";
import {getSubjectAreaDataName} from "../lika-lika-util";
import {CapitalizePipe} from "@utility/capitalize.pipe";
import {StyleMap} from "@utility/style-map";
import {ImageExtension} from "@media/image-extension";

@UntilDestroy()
@Component({
  selector: "app-card-link",
  standalone: true,
  imports: [RouterLink, NgClass, CapitalizePipe],
  templateUrl: "./card-link.component.html",
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardLinkComponent implements OnInit {
  @Input() cardImageSrc: string | null = null;
  @Input() cardAlt: string | null = null;
  @Input() subjectArea: SubjectArea | null = null;
  @Input() routerLink: string[];
  @Input() title: string = "";
  @Input() isCategoryCard: boolean = false;

  public cardImage: IImage;

  private readonly subjectAreaMap: Record<SubjectArea, IImage> = {
    [SubjectArea.KOMMUNIKATION]: {
      src: "kommunikation/spelkort-lank",
      alt: "Ett rosa spelkort för kommunikation",
    },
    [SubjectArea.ESTETISK_VERKSAMHET]: {
      src: "estetisk-verksamhet/spelkort-lank",
      alt: "Ett blått spelkort för estetisk verksamhet",
    },
    [SubjectArea.MOTORIK]: {
      src: "motorik/spelkort-lank",
      alt: "Ett orange spelkort för motorik",
    },
    [SubjectArea.VARDAGSAKTIVITETER]: {
      src: "vardagsaktiviteter/spelkort-lank",
      alt: "Ett grönt spelkort för vardagsaktiviteter",
    },
    [SubjectArea.VERKLIGHETSUPPFATTNING]: {
      src: "verklighetsuppfattning/spelkort-lank",
      alt: "Ett grön-blått spelkort för verklighetsuppfattning",
    },
  };

  public ngOnInit(): void {
    this.cardImage = this.getCardImageBySubjectArea(this.subjectArea, {
      src: this.cardImageSrc || "assets/subject-area/kommunikation/spelkort-lank.svg",
      alt: this.cardAlt || "Standard spelkort",
    });

    if (this.title === "" && this.subjectArea) {
      this.title = this.subjectArea;
    }
  }

  private readonly baseCardImageStyle: string = "w-[85%] md:w-72 2xl:w-80 relative left-1.5";

  private readonly cardImageStyles: StyleMap = {
    "subject-area": "xl:w-56 2xxl:w-72 3xl:w-80",
    category: "2xxl:w-92 3xl:w-[22rem]",
  };

  public getCardImageStyle(): string {
    const uniqueStyling: string = this.isCategoryCard ? this.cardImageStyles["category"] : this.cardImageStyles["subject-area"];

    return `${this.baseCardImageStyle} ${uniqueStyling}`;
  }

  private getCardImageBySubjectArea(subjectArea: SubjectArea | null, defaultImage: IImage): IImage {
    const image: IImage | null = subjectArea ? this.subjectAreaMap[subjectArea] : null;
    return image ? {src: `assets/subject-area/${image.src}${ImageExtension.SVG}`, alt: image.alt} : defaultImage;
  }

  public get subjectAreaDataName(): string {
    if (!this.subjectArea) {
      return "";
    }

    return getSubjectAreaDataName(this.subjectArea);
  }
}
