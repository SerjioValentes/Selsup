import React from 'react';

// Определяем интерфейсы для параметров и модели
interface Param {
  id: number;
  name: string;
  type: 'string';
}

interface ParamValue {
  paramId: number;
  value: string;
}

interface Model {
  paramValues: ParamValue[];
}

interface Props {
  params: Param[];
  model: Model;
}

interface State {
  paramValues: ParamValue[];
}

class ParamEditor extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // Инициализация состояния с параметрами модели
    this.state = {
      paramValues: this.initializeParamValues(props.params, props.model.paramValues),
    };
  }

  // Метод для инициализации значений параметров, если они уже есть в модели
  initializeParamValues(params: Param[], existingValues: ParamValue[]): ParamValue[] {
    return params.map(param => {
      const existingValue = existingValues.find(value => value.paramId === param.id);
      return {
        paramId: param.id,
        value: existingValue ? existingValue.value : '',
      };
    });
  }

  // Метод для обновления значения параметра в состоянии
  handleChange = (paramId: number, newValue: string) => {
    this.setState(prevState => ({
      paramValues: prevState.paramValues.map(paramValue =>
        paramValue.paramId === paramId ? { ...paramValue, value: newValue } : paramValue
      ),
    }));
  };

  // Метод для получения полной модели с актуальными значениями параметров
  getModel(): Model {
    return {
      paramValues: this.state.paramValues,
    };
  }

  render() {
    const { params } = this.props;
    const { paramValues } = this.state;

    return (
      <div>
        <h2>Редактор параметров товара</h2>
        <form>
          {params.map(param => {
            const paramValue = paramValues.find(value => value.paramId === param.id);

            return (
              <div key={param.id} style={{ marginBottom: '10px' }}>
                <label>{param.name}</label>
                <input
                  type="text"
                  value={paramValue ? paramValue.value : ''}
                  onChange={e => this.handleChange(param.id, e.target.value)}
                  placeholder={`Введите ${param.name}`}
                />
              </div>
            );
          })}
        </form>
        <div>
          <h3>Полная модель:</h3>
          <pre>{JSON.stringify(this.getModel(), null, 2)}</pre>
        </div>
      </div>
    );
  }
}

// Пример использования компонента
const App = () => {
  const params: Param[] = [
    { id: 1, name: 'Назначение', type: 'string' },
    { id: 2, name: 'Длина', type: 'string' },
  ];

  const model: Model = {
    paramValues: [
      { paramId: 1, value: 'повседневное' },
      { paramId: 2, value: 'макси' },
    ],
  };

  return <ParamEditor params={params} model={model} />;
};

export default App;
