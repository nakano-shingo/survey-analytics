import { VisualizationManager } from "./visualizationManager";
import { SurveyModel, IQuestion, QuestionPanelDynamicModel } from "survey-core";

export class VisualizationPanel {
  constructor(
    protected targetElement: HTMLElement,
    protected survey: SurveyModel,
    protected questions: Array<IQuestion>,
    protected data: Array<{ [index: string]: any }>,
    protected options?: Object
  ) {}

  render() {
    const survey = this.survey;
    const questions = this.questions;

    var normalizedData = this.data.map(function(item) {
      questions.forEach(function(q) {
        if (!item[q.name]) {
          item[q.name] = "";
        }
      });
      return item;
    });

    questions.forEach(question => {
      let questionContainerElement = document.createElement("div");
      let titleElement = document.createElement("h3");
      titleElement.innerText = (<any>question)["title"];

      questionContainerElement.appendChild(titleElement);
      this.targetElement.appendChild(questionContainerElement);

      if (question.getType() === "paneldynamic") {
        var visPanel = new VisualizationPanel(
          document.getElementById("summaryContainer"),
          survey,
          (<any>question)["panels"][0].questions,
          normalizedData
        );
        visPanel.render();
      }

      this.renderQuestionVisualication(
        questionContainerElement,
        question,
        survey,
        normalizedData
      );
    });
  }

  destroy() {
    this.targetElement.innerHTML = "";
  }

  renderQuestionVisualication(
    questionContainerElement: HTMLElement,
    question: IQuestion,
    survey: SurveyModel,
    data: Array<{ [index: string]: any }>
  ): void {
    var visualizers = VisualizationManager.getVisualizers(question.getType());
    var visualizer = new visualizers[0](
      questionContainerElement,
      survey,
      question.name,
      data
    );
    visualizer.render();
  }
}