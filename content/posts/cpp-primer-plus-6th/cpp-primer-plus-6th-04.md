---
title: 《C++ Primer Plus》第六版——练习题
date: 2023-05-08T11:00:00+08:00
lastmod: 2025-05-08T11:00:31+08:00
slug: cpp-primer-plus-6th-04
draft: false
summary: "C++ Primer Plus 第六版各章编程练习题解答，涵盖基础到高级主题。"
keywords:
  - C++ Primer Plus
weight: 0
tags:
  - CPP笔记
categories:
  - CPP
toc: true
collections:
  - cpp-primer-plus-6th
---

# 第 2 章 《开始学习C++》 编程练习题之我解

## 2.1

**题：** 编写一个C++程序，它显示您的姓名和地址。

**解：**

```Cpp
#include <iostream>

int main() {

    using namespace std;

    cout << "Hi there, I'm Shujia Huang from Shenzhen, Guangdong, China" << endl;
    return 0;
}

```


## 2.2

**题：** 编写一个C++程序，它要求用户输入一个以 long 为单位的距离， 然后将它转换为码（yard，一long 等于 220 码）。
    
**解：**


```Cpp

#include <iostream>

int main() {

    using namespace std;

    int distance=0, yard;
    cout << "Please input a distance numebr in the unit of Long: ";
    cin >> distance;
    yard = distance * 220;

    cout << "The distance tranform in yards is: " << yard << endl;

    return 0;
}

```

## 2.3

**题：** 编写一个C++程序，它使用 3 个用户定义的函数（包括main()），并生成下面的输出：

```bash

Three blind mice
Three blind mice
See how they run
See how they run

```
其中一个函数要调用两次，该函数生成前两行；另一个函数也被调用两次，并生成其余的输出。


**解：**


```Cpp

#include <iostream>

using namespace std;

void blind_mice() {
    cout << "Three blind mice." << endl;
    return;
}

void how_they_run() {
    cout << "See how they run" << endl;
    return;
}

int main() {

    blind_mice();
    blind_mice();

    how_they_run();
    how_they_run();
    return 0;
}

```


## 2.4

**题：** 编写一个程序，让用户输入其年龄，然后显示该年龄包含多少个月，如下所示：

```bash
Enter your age: 29

```

**解：**

```Cpp
#include <iostream>

int main() {

    using namespace std;

    int years, months;
    cout << "Enter your age: ";
    cin >> years;

    months = years * 12;
    cout << years << " years is " << months << " monthes." << endl;  
    return 0;
}

```


## 2.5

**题：** 编写一个程序，其中的main( )调用一个用户定义的函数（以摄氏温度值为参数，并返回相应的华氏温度值）。该程序按下面的格式要 求用户输入摄氏温度值，并显示结果：

```bash
Please enter a Celsius value: 20

20 degrees Celsius is 68 degrees Fahrenheit.

```

转换公式：华氏温度 = 1.8×摄氏温度 + 32.0


**解：**

```Cpp

#include <iostream>


double celsiu2fahrenit(double celsius) {
    return 1.8 * celsius + 32.0;
}


int main() {

    using namespace std;

    double celsius;
    cout << "Please enter a celsius value: ";
    cin >> celsius;

    cout << celsius << " degrees Celsius is " 
         << celsiu2fahrenit(celsius) << " degrees Fahrenheit." << endl;

    return 0;
}

```


## 2.6

**题：** 编写一个程序，其main( )调用一个用户定义的函数（以光年值为参数，并返回对应天文单位的值）。该程序按下面的格式要求用户输 入光年值，并显示结果：

```bash

Enter the number of light years: 4.2

4.2 light years = 265608 astromonical units.

```
天文单位是从地球到太阳的平均距离（约150000000公里或93000000英里），光年是光一年走的距离（约10万亿公里或6万亿英里）（除太阳外，最近的恒星大约离地球4.2光年）。请使用double类型，转换公式为：1光年=63240天文单位.


**解：**

```Cpp

#include <iostream>


double light_years2astromonical_unit(double light_years) {

    return light_years * 63240;
}


int main() {

    using namespace std;

    double light_years;
    cout << "nter the number of light years: ";
    cin >> light_years;

    cout << light_years 
         << " light years = " 
         << light_years2astromonical_unit(light_years)
         << " astromonical units." << endl;

    return 0;
}

```

## 2.7

**题：** 编写一个程序，要求用户输入小时数和分钟数。在 main() 函数中，将这两个值传递给一个void函数，后者以下面这样的格式显示这两个值：

```bash

Enter the number of hours: 9
Enter the number of minutes: 28

Time: 9:28

```

**解：**

```Cpp

#include <iostream>

using namespace std;


void display_time(double hours, double minutes) {

    cout << "Time: " << hours << ":" << minutes << endl;

    return;
}

int main() {    

    double hours, minutes;
    cout << "Enter the number of hours: ";
    cin >> hours;

    cout << "Enter the number of minutes: ";
    cin >> minutes;

    display_time(hours, minutes);

    return 0;
}

```

# 第 3 章 《处理数据》 编程练习题之我解

## 3.1

**题：** 编写一个小程序，要求用户使用一个整数指出自己的身高（单位为英寸），然后将身高转换为英尺和英寸。该程序使用下划线字符来指示输入位置。另外，使用一个const符号常量来表示转换因子。

**解:**

```Cpp

#include <iostream>


const int Foot2inch = 12;

int main() {

    using namespace std;

    int input_height = 0;
    cout << "Please input you height in inch: __\b\b";
    cin >> input_height;

    int height_foot = input_height / Foot2inch;
    int height_inch = input_height % Foot2inch;

    cout << "Your height in inch is: " << input_height 
         << "; transforming in foot and inch is: " 
         << height_foot << " foot "
         << height_inch << " inch." << endl;

    return 0;
}

```


## 3.2

**题：** 编写一个小程序，要求以几英尺几英寸的方式输入其身高，并以磅为单位输入其体重。（使用3个变量来存储这些信息。）该程序报告其BMI（Body Mass Index，体重指数）。为了计算BMI，该程序以英寸的方式指出用户的身高（1英尺为12英寸），并将以英寸为单位的身 高转换为以米为单位的身高（1英寸=0.0254米）。然后，将以磅为单位 的体重转换为以千克为单位的体重（1千克=2.2磅）。最后，计算相应的BMI—体重（千克）除以身高（米）的平方。用符号常量表示各种转 换因子。

**解：**

```Cpp
#include <iostream>

const int Foot2Inch = 12;
const double Inch2Meter = 0.0254;
const double Kg2Pound = 2.2;

double BMI(double weight, double height) {

    return weight/(height*height);
}

int main() {

    using namespace std;

    double height_foot = 0;
    double height_inch = 0;
    double weight_pound = 0;

    cout << "Please enter your height in foot and Inch2Meter." << endl;
    cout << "Enter the foot of height: __\b\b";
    cin >> height_foot;

    cout << "Enter the inch of height: __\b\b";
    cin >> height_inch;

    cout << "Please enter your weight in pound: __\b\b";
    cin >> weight_pound;

    double height_meter = (height_foot * Foot2Inch + height_inch) * Inch2Meter;
    double weight_kg = weight_pound / Kg2Pound;
    double bmi = BMI(weight_kg, height_meter);

    cout << "Your BMI is: " << bmi << endl;

    return 0;
}

```


## 3.3

**题：** 编写一个程序，要求用户以度、分、秒的方式输入一个纬度，然后以度为单位显示该纬度。1度为60分，1分等于60秒，请以符号常量的方式表示这些值。对于每个输入值，应使用一个独立的变量存储它。 下面是该程序运行时的情况：

```bash

Enter a latitude in degree, minutes, and seconds:
First, enter the degree: 37
Next, enter the minutes of arc: 51
Finally, enter the seconds of arc: 19

37 degrees, 51 minutes, 19 seconds = 37.8553 degrees.

```

**解：**

```Cpp

#include <iostream>


int main() {

    using namespace std;

    double degree, minutes, seconds;

    cout << "Enter a latitude in degree, minutes and seconds." << endl;
    cout << "First, enter the degree: ";
    cin >> degree;

    cout << "Next, enter the minutes of arc: ";
    cin >> minutes;

    cout << "Finally, enter the seconds of arc: ";
    cin >> seconds;

    double degree2 = degree + minutes/60 + seconds/3600;
    cout << degree << " degrees, " << minutes << " minutes, "
         << seconds << " seconds = " << degree2 << endl;

    return 0;
}

```


## 3.4

**题：** 编写一个程序，要求用户以**整数**方式输入秒数（使用long或long long变量存储），然后以天、小时、分钟和秒的方式显示这段时间。使用符号常量来表示每天有多少小时、每小时有多少分钟以及每分钟有多 少秒。该程序的输出应与下面类似：

```bash
Enter the number of seconds: 31600000
31600000 seconds = 365 days, 17 hours, 46 minutes, 40 seconds.

```

**解：**

```Cpp

#include <iostream>

int main() {

    using namespace std;

    long total_seconds;

    cout << "Enter the number of seconds: ";
    cin >> total_seconds;

    int days = total_seconds / 86400;
    int hours = (total_seconds % 86400) / 3600;
    int minutes = ((total_seconds % 86400) % 3600) / 60;
    int seconds = ((total_seconds % 86400) % 3600) % 60;

    cout << total_seconds << "seconds = " 
         << days << " days, " 
         << hours << " hours, "
         << minutes << " minutes, "
         << seconds << " seconds." << endl;

    return 0;
}

```


## 3.5

**题：** 编写一个程序，要求用户输入全球当前的人口和中国当前的人口（或其他国家的人口）。将这些信息存储在long long变量中，并让程序显示中国（或其他国家）的人口占全球人口的百分比。该程序的输出 应与下面类似：

```bash
Enter the world's population: 7850176700
Enther the population of China: 1411780000
The population of the China is 17.9841% of the world population.

```

**解：**

```Cpp

#include <iostream>

int main() {
    using namespace std;

    long long population_world, population_China;
    cout << "Enter the world's population: ";
    cin >> population_world;
    cout << "Enter the population of China: ";
    cin >> population_China;

    double rate = double(population_China)/population_world;
    cout << "The population of the China is " << rate * 100
         << "% of the world population." << endl;

    return 0;
}

```


## 3.6 

**题：** 编写一个程序，要求用户输入驱车里程（英里）和使用汽油量（加仑），然后指出汽车耗油量为一加仑的里程。如果愿意，也可以让程序要求用户以公里为单位输入距离，并以升为单位输入汽油量，然后 指出欧洲风格的结果—即每100公里的耗油量（升）。

**解：**

```Cpp

#include <iostream>

int main() {
    using namespace std;
    double kilometer, oil_liter;

    cout << "Enter the distance that you've dirver in kilometer: ";
    cin >> kilometer;

    cout << "Enter the comsumption of oil: ";
    cin >> oil_liter;

    double kilometer_per_liter = kilometer / oil_liter;
    cout << "The average fuel comsumption is " 
         << 100 / kilometer_per_liter << " L/100km" << endl;
}

```


## 3.7

**题：** 编写一个程序，要求用户按欧洲风格输入汽车的耗油量（每100公里消耗的汽油量（升）），然后将其转换为美国风格的耗油量—每加仑多少英里。

> 注意，除了使用不同的单位计量外，美国方法（距离/燃 料）与欧洲方法（燃料/距离）相反。100公里等于62.14英里，1加仑等于3.875升。因此，19mpg大约合12.4l/100km，27mpg大约合 8.71/100km。 

**解：**

```Cpp

#include <iostream>

int main() {
    using namespace std;

    const double Km2Mile = 0.6214;
    const double Gallon2Litre = 3.875;

    double fuel_comsuption_en = 0.0;
    cout << "Enter the fuel comsuption in European standard: ";
    cin >> fuel_comsuption_en;

    double fuel_comsuption_us = (100 * Km2Mile) / (fuel_comsuption_en/Gallon2Litre);
    cout << "The fuel comsuption in US standard is " << fuel_comsuption_us 
         << " Miles/Gallon (mpg)." << endl;  

    return 0;
}

```


# 第四章 《复合类型》 编程练习题之我解

## 4.1

**题：** 编写一个程序，如下输出实例所示的请求并显示信息：

```bash
What is your first name? Betty Sue
Waht is your last name? Yewe
What letter grade do you deserve? B 
What is your age? 22

Name: Yewe, Betty Sue
Grade: C 
Age: 22

```

> 程序应接受的名字包含多个单词。另外，程序将向下调整成绩。假设用户请求A、B或C，返回 B、C 或 D。


**解：**

```Cpp
#include <iostream>

int main() {

    using namespace std;

    char first_name[40];
    char last_name[40];
    char grade_letter;
    int age;

    cout << "What is your first name: ";
    cin.getline(first_name, 40);

    cout << "What is your last name: ";
    cin.getline(last_name, 40);

    cout << "What letter grade do you deserve: ";
    cin >> grade_letter;

    cout << "What is your age: ";
    cin >> age;

    cout << "Name: " << last_name << ", " << first_name << endl;
    cout << "Grade: " << char(grade_letter+1) << "\n";
    cout << "Age: " << age << endl;

    return 0;
}

```


## 4.2

**题：** 修改程序清单4.4，使用 C++ `string` 类而不是 `char` 数组。

**解：**

```Cpp
#include <iostream>
#include <string>

int main() {
    using namespace std;

    string name;
    string dessert;

    cout << "Enter your name: \n";
    getline(cin, name);

    cout << "Enter your favorite dessert:\n";
    getline(cin, dessert);

    cout << "I have delicious " << dessert;
    cout << " for you,  " << name << ".\n";

    return 0;
}

```

## 4.3

**题：** 编写一个程序，它要求用户首先输入其名，然后输入其姓；然后程序使用一个逗号和空格将姓和名组合起来，并存储和显示组合结果。请使用char数组和头文件cstring中的函数。下面是该程序运行时的 情形：

```bash
Enter your first name: Flip
Enter your last name: Fleming
Here's the information in a single string: Fleming, Flip

```

**解：**

```Cpp
#include <iostream>
#include <cstring>

int main() {

    using namespace std;
    char first_name[20], last_name[20];
    char final_name[50];

    cout << "Enter your first name: ";
    cin.getline(first_name, 20);

    cout << "Enther your last name: ";
    cin.getline(last_name, 20);

    strcpy(final_name, last_name);
    strcat(final_name, ", ");
    strcat(final_name, first_name);

    cout << "Here's the information in a single string: " << final_name << endl;

    return 0;
}

```


## 4.4

**题：** 编写一个程序，它要求用户首先输入其名，再输入其姓；然后程序使用一个逗号和空格将姓和名组合起来，并存储和显示组合结果。请使用string对象和头文件string中的函数。下面是该程序运行时的情形：

```bash
Enter your first name: Flip
Enter your last name: Fleming
Here's the information in a single string: Fleming, Flip

```

**解：**


```Cpp
#include <iostream>
#include <string>

int main() {

    using namespace std;
    string first_name, last_name;
    string final_name;

    cout << "Enter your first name: ";
    getline(cin, first_name);

    cout << "Enther your last name: ";
    getline(cin, last_name);

    final_name = last_name + ", " + first_name;

    cout << "Here's the information in a single string: " << final_name << endl;

    return 0;
}

```


## 4.5

**题：** 结构体 `CandyBar` 包含3个成员。第一个成员存储了糖块的品牌；第二个成员存储糖块的重量（可以有小数）；第三个成员存储了糖块的卡路里含量（整数）。编写一个程序，声明这个结构体，创建一个名为 `snack` 的 `CandyBar` 变量，并将其成员分别初始化为 "Mocha Munch"、2.3 和 350。初始化应在声明 `snack` 时进行。最后，程序显示 `snack` 变量的内容。


**解：**

```Cpp
#include <iostream>
#include <string>

struct CandyBar
{
    std::string name;
    double weight;
    int calories;
};


int main() {
    using namespace std;

    CandyBar snack = {"Mocha Munch", 2.3, 350};  // 初始化结构体

    cout << "The name of the CandyBar: " << snack.name << "\n";
    cout << "The weight of the candy: " << snack.weight << "\n";
    cout << "The calories information: " << snack.calories << endl;

    return 0;
}

```


## 4.6

**题：** 结构体 `CandyBar` 包含3个成员，如 `编程练习5`所示。请编写一个程序，创建一个包含 3 个元素的 `CandyBar` 数组，并将它们初始化为所选择的值，然后显示每个结构体的内容。


**解：**

```Cpp
#include <iostream>
#include <string>

struct CandyBar
{
    std::string name;
    double weight;
    int calories;
};


int main() {

    using namespace std;

    CandyBar candbar[3] = {
        {"Mocha Munch", 2.3, 350},
        {"Big Rabbit", 5, 300},
        {"Joy Boy", 4.1, 430}
    };

    cout << "The name of the CandyBar: " << candbar[0].name << "\n"
         << "The weight of the candy: " << candbar[0].weight << "\n"
         << "The calories information: " << candbar[0].calories << "\n\n";

    cout << "The name of the CandyBar: " << candbar[1].name << "\n"
         << "The weight of the candy: " << candbar[1].weight << "\n"
         << "The calories information: " << candbar[1].calories << "\n\n";

    cout << "The name of the CandyBar: " << candbar[2].name << "\n"
         << "The weight of the candy: " << candbar[2].weight << "\n"
         << "The calories information: " << candbar[2].calories << endl;

    return 0;
}

```

## 4.7

**题：** William Wingate从事比萨饼分析服务。对于每个披萨饼，他都需要记录下列信息：

- 披萨饼公司的名称，可以有多个单词组成；
- 披萨饼的直径；
- 披萨饼的重量。

请设计一个能够存储这些信息的结构体，并编写一个使用这种结构体变量的程序。程序将请求用户输入上述信息，然后显示这些信息。请使用 cin（或其它的方法）和cout。

**解：**

```Cpp

#include <iostream>
#include <string>

struct Pizza
{
    std::string company;
    double diameter;
    double weight;
    
};

int main() {
    using namespace std;

    Pizza pizza;
    cout << "Enter the pizza company: ";
    getline(cin, pizza.company);

    cout << "Enter the diameter of pizza: ";
    cin >> pizza.diameter;

    cout << "Enter the weight of pizza: ";
    cin >> pizza.weight;

    cout << "\nHere is the pizza information: \n"
         << "Company: " << pizza.company << "\n"
         << "Diameter: " << pizza.diameter << "\n"
         << "Weight: " << pizza.weight << endl;

    return 0;
}

```

## 4.8

**题：** 完成编程练习7，但使用 `new` 来为结构体分配内存，而不是声明一个结构体变量。另外，让程序在请求输入比萨饼公司名称之前输入比萨饼的直径。


**解：**

```Cpp
#include <iostream>
#include <string>

struct Pizza
{
    std::string company;
    double diameter;
    double weight;
};

int main() {
    using namespace std;

    Pizza *pizza = new Pizza;
    
    cout << "Enter the diameter of pizza: ";
    cin >> pizza->diameter;

    cout << "Enter the weight of pizza: ";
    cin >> pizza->weight;

    // 注意上语句输入完 weight 后，回车键留在输入流中，以下的 getline 
    // 碰到输入流中的回车就以为结束了，所以如果没有这个 cin.get() 先读
    // 取回车，那么用户永远获得 company 的值。
    cin.get(); 

    cout << "Enter the pizza company: ";
    getline(cin, pizza->company);

    cout << "\nHere is the pizza information: \n"
         << "Company: " << pizza->company << "\n"
         << "Diameter: " << pizza->diameter << "\n"
         << "Weight: " << pizza->weight << endl;

    delete pizza;

    return 0;
}

```


## 4.9

**题：** 完成编程练习6，但使用 `new` 来动态分配数组，而不是声明一个包含 3 个元素的 `CandyBar` 数组。


**解：**

```Cpp
#include <iostream>
#include <string>

struct CandyBar
{
    std::string name;
    double weight;
    int calories;
};


int main() {

    using namespace std;

    CandyBar *p_candybar = new CandyBar [3] {
        {"Mocha Munch", 2.3, 350},
        {"Big Rabbit", 5, 300},
        {"Joy Boy", 4.1, 430}
    };

    // 输出第一个结构体元素，按照数组的方式输出
    cout << "The name of the CandyBar: " << p_candybar[0].name << "\n"
         << "The weight of the candy: " << p_candybar[0].weight << "\n"
         << "The calories information: " << p_candybar[0].calories << "\n\n";

    // 输出第二个结构体元素，可以按照指针的逻辑输出
    cout << "The name of the CandyBar: " << (p_candybar+1)->name << "\n"
         << "The weight of the candy: " << (p_candybar+1)->weight << "\n"
         << "The calories information: " << (p_candybar+1)->calories << "\n\n";

    // 输出第三个结构体元素，又是数据的方式
    cout << "The name of the CandyBar: " << p_candybar[2].name << "\n"
         << "The weight of the candy: " << p_candybar[2].weight << "\n"
         << "The calories information: " << p_candybar[2].calories << endl;

    delete [] p_candybar;

    return 0;
}

```

## 4.10

**题：** 编写一个程序，让用户输入三次 40 码跑的成绩（如果您愿意，也可让用户输入40米跑的成绩），并显示次数和平均成绩。请使用一个 `array`对象来存储数据（如果编译器不支持 `array` 类，请使用数组）。

**解：**

```Cpp
#include <iostream>
#include <array>

int main() {

    using namespace std;

    array<double, 3> result;

    cout << "Enter threed result of the 40 meters runing time: \n";
    cin >> result[0];
    cin >> result[1];
    cin >> result[2];

    double ave_result = (result[0] + result[1] + result[2]) / 3;
    cout << "The all three time results are: " << result[0] << ", "
         << result[1] << ", " << result[2] << endl;

    cout << "The average result: " << ave_result << endl;

    return 0;
}

```

# 第五章 《循环和关系表达式》 编程练习题之我解

## 5.1

**题：** 编写一个要求用户输入两个整数的程序。该程序将计算并输出这两个整数之间（包括这两个整数）所有整数的和。这里假设先输入较小的整数。例如，用户输入的是2和9，则程序将指出2～9之间所有整数的和为44。


**解：**

```Cpp
#include <iostream>

int main() {
    using namespace std;
    int number1, number2;

    cout << "Enter the first number: ";
    cin >> number1;

    cout << "Enter the second number: ";
    cin >> number2;

    if (number1 > number2) {
        int tmp;
        tmp = number1;
        number1 = number2;
        number2 = tmp;
    }

    int s = 0;
    for (int num=number1; num < number2+1; ++num) {
        s += num;
    }

    cout << "Sum the number from " << number1 << " to " << number2 
         << ", sum = " << s << endl;

    return 0;
}

```


## 5.2

**题：** 使用 `array` 对象（而不是数组）和 `long double`（而不是 `long long`）重新编写程序清单5.4，并计算 100! 的值。

**解：**

```Cpp
#include <iostream>
#include <array>


const int ar_size = 100;
int main() {
    using namespace std;

    array<long double, ar_size> factorials;

    factorials[0] = factorials[1] = 1;
    for (int i = 2; i < ar_size+1; ++i) {

        factorials[i] = i * factorials[i-1];
    }

    for (int i = 0; i < ar_size + 1; ++i) {

        cout << i << "! = " << factorials[i] << "\n";
    }
    cout << endl;

    return 0;
}

```


## 5.3

**题：** 编写一个要求用户输入数字的程序。每次输入后，程序都将报告到目前为止，所有输入的累计和。当用户输入 0 时，程序结束。


**解：**

```Cpp
#include <iostream>


int main() {
    using namespace std;

    double s = 0;
    double ch;

    while (1) {

        cout << "Enter a number (int/double) (0 to exit): ";
        cin >> ch;

        if (ch == 0) {
            break;
        }

        s += ch;
        cout << "Until now, the sum of the number you inputed is: " 
             << s << endl;
    }

    return 0;
}

```


## 5.4

**题：** Daphne以10%的单利投资了100美元。也就是说，每一年的利润都是投资额的10%，即每年10美元。而Cleo以5%的复利投资了100美元。也就是说，利息是当前存款（包括获得的利息）的5%，Cleo在第一年投资100美元的盈利是5%—得到了105美元。下一年的盈利是105美元的5%—即5.25美元，依此类推。请编写一个程序，计算多少年后，Cleo的投资价值才能超过Daphne的投资价值，并显示此时两个人的投资价值。


**解：**

```Cpp
#include <iostream>

int main() {
    using namespace std;

    double daphne_account = 100;
    double cleo_account = 100;

    int year = 0;
    while (cleo_account <= daphne_account) {
        ++year;

        daphne_account += 10;
        cleo_account += cleo_account * 0.05;
    }

    cout << "After " << year << " Years. " 
         << "Cleo's account is " << cleo_account
         << " while more than the one of Daphne which is " 
         << daphne_account << "." << endl;

    return 0;
}

```


## 5.5

**题：** 假设要销售《C++ For Fools》一书。请编写一个程序，输入全年中每个月的销售量（图书数量，而不是销售额）。程序通过循环，使用初始化为月份字符串的 `char *` 数组（或 `string` 对象数组）逐月进行提示，并将输入的数据储存在一个int数组中。然后，程序计算数组中各元素的总数，并报告这一年的销售情况。


**解：**

```Cpp

#include <iostream>
#include <string>

int main() {
    using namespace std;

    string months[12] = {"Jan", "Feb", "Mar", "Apr", 
                         "May", "Jun", "Jul", "Aug", 
                         "Sep", "Oct", "Nov", "Dec"};
    int sell[12];
    int total_sales = 0;

    cout << "Enter the sales of book <<C++ for Fools>> each month." << endl;
    for (int i=0; i < 12; ++i) {

        cout << months[i] << ":";
        cin >> sell[i];

        total_sales += sell[i];
    }

    cout << "\nThe total sales is " << total_sales << endl;
    for (int i=0; i < 12; ++i) {

        cout << months[i] << ": " << sell[i] << endl;
    }


    return 0;
}
```

## 5.6

**题：** 完成编程练习5，但这一次使用一个二维数组来存储输入——3年中每个月的销售量。程序将报告每年销售量以及三年的总销售量。


**解：**

```Cpp
#include <iostream>
#include <string>


int main() {
    using namespace std;

    string months[12] = {"Jan", "Feb", "Mar", "Apr", 
                         "May", "Jun", "Jul", "Aug", 
                         "Sep", "Oct", "Nov", "Dec"};
    int sells[3][12];
    int total_sales[3] = {0, 0, 0};

    for (int i=0; i<3; ++i) {

        cout << "Enter " << i+1 << " year(s) sales of book <<C++ for Fools>> each month." << endl;
        for (int j=0; j<12; ++j) {
            cout << months[j] << ": ";
            cin >> sells[i][j];

            total_sales[i] += sells[i][j];

        }
    }

    for (int i=0; i<3; ++i) {
        cout << i+1 << " year(s) total sales is " 
             << total_sales[i] << endl;
    }

    cout << "There years total sales is " 
         << total_sales[0] + total_sales[1] + total_sales[2] << endl;

    return 0;
}

```


## 5.7

**题：** 设计一个名为 `car` 的结构体，用它存储下述有关汽车的信息：生产商（存储在字符数组或 `string` 对象中的字符串）、生产年份（整数）。编写一个程序，向用户询问有多少辆汽车。随后，程序使用new来创建一个由相应数量的 `car` 结构体组成的动态数组。接下来，程序提示用户输入每辆车的生产商（可能由多个单词组成）和年份信息。请注意，这需要特别小心，因为它将交替读取数值和字符串（参见第4章）。最后，程序将显示每个结构的内容。该程序的运行情况如下:

How many cars do you wish to catalog? 2
Car #1: 
Please enter the maker: Hudson Hornet
Please enter the year made: 1952
Car #2:
Please enter the maker: Kaiser
Please enter the year made: 1951
Here is your collection:
1952 Hudson Hornet
1951 Kaiser


**解：**

```Cpp
#include <iostream>
#include <string>


int main() {
    using namespace std;

    struct Car {
        string company;
        int year;  
    };

    int car_num = 0;
    cout << "How many cars do you wish to catalog? ";
    cin >> car_num;
    cin.get()  // 读取输入流末尾的回车

    Car *cars = new Car[car_num];
    for (int i=0; i < car_num; ++i) {
        cout << "Please enter the maker: ";
        cin >> (cars+i)->company;

        cout << "Please enter the year made: ";
        cin >> (cars+i)->year;
    }

    cout << "\nHere is your collection: \n";
    for (int i=0; i < car_num; ++i) {
        cout << cars[i].year << " " << cars[i].company << endl;
    }

    delete [] cars;
    return 0;
}
```


## 5.8

**题：** 编写一个程序，它使用一个 `char`数组和循环，每次读取一个单词，直到用户输入 `done` 为止。随后，该程序指出用户输入了多少个单词（不包括done在内）。下面是该程序的运行情况：

Enter words (type 'done' to stop):
anteater birthday category dumpster
envy finagle genometry done for sure

You entered a total of 7 words.

> 您应在程序中包含头文件 `cstring`，并使用函数 `strcmp()` 来进行比较测试。


**解：**

```Cpp
#include <iostream>
#include <cstring>

int main() {
    using namespace std;

    int word_count = 0;
    char ch[80];
    cout << "Enter a word (type 'done' to stop the program.): \n";
    do {
        cin >> ch;

        if (strcmp(ch, "done") != 0) {
            word_count++;
        }

    } while (strcmp(ch, "done") != 0);

    cout << "\nYou entered a total of " << word_count << " words." << endl;

    return 0;
}

```



## 5.9

**题：** 编写一个满足前一个练习中描述的程序，但使用 `string` 对象而不是字符数组。请在程序中包含头文件 `string`，并使用关系运算符来进行 比较测试。


**解：**

```Cpp
#include <iostream>
#include <string>

int main() {
    using namespace std;

    int word_count = 0;
    string ch;
    cout << "Enter a word (type 'done' to stop the program.): \n";
    do {
        cin >> ch;

        if (ch != "done") {
            word_count++;
        }

    } while (ch != "done");

    cout << "\nYou entered a total of " << word_count << " words." << endl;

    return 0;
}

```


## 5.10

**题：** 编写一个使用嵌套循环的程序，要求用户输入一个值，指出要显示多少行。然后，程序将显示相应行数的星号，其中第一行包括一个星号，第二行包括两个星号，依此类推。每一行包含的字符数等于用户指定的行数，在星号不够的情况下，在星号前面加上句点。该程序的运 行情况如下：

Enter number of rows: 5
Output: 
....*
...**
..***
.****
*****


**解:**

```Cpp
#include <iostream>

int main() {

    using namespace std;
    int line_num = 0;

    cout << "Enter the number of rows: ";
    cin >> line_num;

    cout << "Output:" << endl;
    for (int i = line_num; i > 0; --i) {

        for (int j = i-1; j > 0; --j) {
            cout << ".";
        }
        for (int j = line_num - (i-1); j > 0; --j) {
            cout << "*";
        }
        cout << "\n";
    }

    return 0;
}

```

# 第六章 《分支语句和逻辑运算符》 编程练习题之我解

## 6.1

**题：** 编写一个程序，读取键盘输入，直到遇到 `@`符号为止，并回显输入（数字除外），同时将大写字符转换为小写，将小写字符转换为大 写（别忘了`cctype`函数系列）。


**解：**

```Cpp
#include <iostream>
#include <cctype>


int main() {
    using namespace std;
    char ch;

    cout << "Enter any charater: ";
    while ((ch=cin.get()) != '@') {

        if (isdigit(ch)) {
            continue;
        } else if (islower(ch)) {
            ch = toupper(ch);
        } else if (isupper(ch)) {
            ch = tolower(ch);
        }

        cout << ch;

    }

    cout << "** done **" << endl;

    return 0;
}
```


## 6.2

**题：** 编写一个程序，最多将10个 `donation` 值读入到一个 `double` 数组中（如果您愿意，也可使用模板类 `array` ）。程序遇到非数字输入时将结束输入，并报告这些数字的平均值以及数组中有多少个数字大于平均值。


**解：**

```Cpp
#include <iostream>
#include <array>


int main() {
    using namespace std;
    
    const unsigned int size = 10;
    array<double, size> donation;

    double sum_value = 0;
    unsigned int large_avg = 0, n = 0;

    cout << "Enter 10 double value or type non-digital value to exit: ";
    while ((n < size) && (cin >> donation[n])) {
        
        sum_value += donation[n];
        ++n;
    }

    double avg = sum_value / n;
    for (int i=0; i < n; i++) {

        if (donation[i]>avg)
            ++large_avg;
    }

    cout << "The average value is: " << avg
         << ", there are " << large_avg
         << " larger than average value." << endl;

    return 0;
}

```


## 6.3

**题：** 编写一个菜单驱动程序的雏形。该程序显示一个提供4个选项的菜单——每个选项用一个字母标记。如果用户使用有效选项之外的字母进行响应，程序将提示用户输入一个有效的字母，直到用户这样做为止。然后，该程序使用一条 `switch` 语句，根据用户的选择执行一个简单操作。该程序的运行情况如下：

```bash
Please enter one of the following choices:

c) carnivore    p) pianist
t) tree         g) game
f

Please enter a c, p, t, or g: q
A maple is a tree.

```

**解：**

```Cpp
#include <iostream>

int main() {

    using namespace std;
    cout << "Please enter one of the following choice: \n";
    cout << "c) carnivore\tp) pianist.\n"
         << "t) tree\tg) game" << endl;

    bool exit = false;
    char c;
    while (!exit && (cin >> c)) {

        switch (c) {
            case 'c': 
                cout << "Tiger is a carnivore." << endl;
                exit = true;
                break;
            case 'p':
                cout << "Mozart is a great pianst." << endl;
                exit = true;
                break;
            case 't':
                cout << "A maple is a tree." << endl;
                exit = true;
                break;
            case 'g':
                cout << "Supper Mario is a great game." << endl;
                exit = true;
                break;

            default:
                cout << "Please enter c, p, t, or g: q" << endl;
                break;
        }
    }
    return 0;
}

```


## 6.4

**题：** 加入 `Benevolent Order of Programmer` 后，在BOP大会上，人们便可以通过加入者的真实姓名、头衔或秘密BOP姓名来了解他（她）。请编写一个程序，可以使用真实姓名、头衔、秘密姓名或成员偏好来列出成员。编写该程序时，请使用下面的结构：

```Cpp
// Benevolent order of programmers strcture

struct bop {
    char fullname[strsize]; // real name
    char title[strsize];    // job title
    char bopname[strsize];  // secret BOP name
    int preference;         // 0 = fullname, 1 = title, 2 = bopname
};

```

该程序创建一个有上述结构体组成的小型数组，并将其初始化为适当的值。另外，该程序使用一个循环，让用户在下面的选项中进行选择：

```bash
a. display by name     b. display by title
c. display by bopname  d. display by preference
q. quit
```

注意，`display by preference` 并不意味着显示成员的偏好，而是意味着根据成员的偏好来列出成员。例如，如果偏好号为 1，则选择 d 将显示成员的头衔。该程序的运行情况如下：

```bash
Benevolent order of Programmers report.

a. display by name     b. display by title
c. display by bopname  d. display by preference
q. quit

Enter your choices: a
Wimp Macho
Raki Rhodes
Celia Laiter
Hoppy Hipman
Pat Hand

Next choice： d   
Wimp Macho
Junior Programmer
MIPS
Analyst Trainee
LOOPY

Next choice: q
Bye!

```


**解：**


```Cpp
#include <iostream>


int main() {

    using namespace std;

    const int strsize = 80;
    struct Bop {
        char fullname[strsize]; // real name
        char title[strsize];    // job title
        char bopname[strsize];  // secret BOP name
        int preference;         // 0 = fullname, 1 = title, 2 = bopname
    };

    const int size = 5;
    const Bop bops[size] = {
        {"Wimp Macho", "bbb", "c", 0},
        {"Raki Rhodes", "2XXXX", "3XXXXX", 1},
        {"Celia Laiter", "2AAAA", "3AAAAA", 2},
        {"Hoppy Hipman", "2BBBB", "3BBBBB", 0},
        {"Pat Hand", "4CCCC", "3CCCCC", 1}
    };

    cout << "Benevolent order of Programmers report.\n";
    cout << "a. display by name     b. display by title\n"
         << "c. display by bopname  d. display by preference\n"
         << "q. quit" << endl;

    char ch;
    while (cin >> ch) {

        if (ch == 'q') { 
            break; 
        }

        for (int i=0; i < size; ++i) {

            switch (ch) {
                case 'a':
                    cout << bops[i].fullname << "\n";
                    break;
                case 'b':
                    cout << bops[i].title << "\n";
                    break;
                case 'c':
                    cout << bops[i].bopname << "\n";
                    break;
                case 'd':
                    cout << bops[i].preference << "\n";
                    break;

                default:
                    break;
            }
        }

        cout << "Next choice: ";
    }
    cout << "** Done **" << endl;
    return 0;
}

```


## 6.5

**题：** 在 `Neutronia` 王国，货币单位是 `tvarp`，收入所得税的计算方式如下：

- 5000 tvarps：不收税;
- 5001～15000 tvarps：10%;
- 15001～35000 tvarps：15%;
- 35000 tvarps以上：20%;

例如，收入为 `38000 tvarps` 时，所得税为 `5000 * 0.00 + 10000 * 0.10 + 20000 * 0.15 + 3000 * 0.20`，
即 `4600 tvarps`。请编写一个程序，使用循环来 要求用户输入收入，并报告所得税。当用户输入负数或非数字时，循环将结束。


**解：**

```Cpp
#include <iostream>

int main() {
    using namespace std;
    const double tax_rate1 = 0.1;
    const double tax_rate2 = 0.15;
    const double tax_rate3 = 0.20;

    double income = 0.0, tax = 0.0;
    cout << "Please enter your income: ";
    while ((cin >> income) && (income > 0)) {

        if (income <= 5000) {
            tax = 0.0;
        } else if (income <= 15000 ) {

            tax = (income - 5000) * tax_rate1;
        } else if (income <= 35000) {

            tax = (15000 - 5000) * tax_rate1 + (income - 15000) * tax_rate2;
        } else {
            tax = (15000 - 5000) * tax_rate1 + (35000 - 15000) * tax_rate2 + (income - 35000) * tax_rate3;
        }

        cout << "Income = " << income << ", tax = " << tax << endl;
        cout << "Please enter your income again or enter a negative value to quit: ";
    }

    return 0;
}

```


## 6.6

**题：** 编写一个程序，记录捐助给 “维护合法权利团体” 的资金。该程序要求用户输入捐献者数目，然后要求用户输入每一个捐献者的姓名和款项。这些信息被储存在一个动态分配的结构体数组中。每个结构体有两个成员：用来储存姓名的字符数组（或 `string`对象）和用来存储款项的 `double`成员。读取所有的数据后，程序将显示所有捐款超过 10000 的捐款者的姓名及其捐款数额。

该列表前应包含一个标题，指出下面的捐款者是重要捐款人 Grand Patrons。然后，程序将列出其他的捐款者，该列表要以 `Patrons` 开头。如果某种类别没有捐款者，则程序将打印单词 `none`。该程序只显示这两种类别，而不进行排序。


**解：**

```Cpp
#include <iostream>
#include <string>


int main() {

    using namespace std;

    const int Grand_Amount = 10000; 

    struct Patron {
        string name;
        double amount;
    };

    int contribute_num = 0;
    cout << "Enter the number of contributor: ";
    cin >> contribute_num;
    cin.get();  // 读取输入流中的回车符

    Patron *p_contribution = new Patron [contribute_num];
    for (int i = 0; i < contribute_num; ++i) {
        cout << "Enter the name of " << i + 1 << " contributor: ";
        getline(cin, p_contribution[i].name);

        cout << "Enter the amount of donation: ";
        cin >> p_contribution[i].amount;
        cin.get();  // 读取输入流中的回车符
    }

    unsigned int grand_amount_n = 0;
    cout << "\nGrand patron: " << endl;
    for (int i = 0; i < contribute_num; ++i) {

        if (p_contribution[i].amount > Grand_Amount) {
            cout << "Contributor name: " << p_contribution[i].name << "\n"
                 << "Contributor amount: " << p_contribution[i].amount << endl;
            ++grand_amount_n;
        }
    }

    if (grand_amount_n == 0) {
        cout << "None" << endl;
    }

    bool is_empty = true;
    cout << "\nPatrons: " << endl;
    for (int i=0; i < contribute_num; ++i) {
        cout << "Contributor name: " << p_contribution[i].name << "\n"
             << "Contributor amount: " << p_contribution[i].amount << endl;

        is_empty = false;
    }

    if (is_empty) {
        cout << "** None **" << endl;
    }

    return 0;
}

```


## 6.7

**题：** 编写一个程序，它每次读取一个单词，直到用户输入 `q`。然后，该程序指出有多少个单词以元音打头，有多少个单词以辅音打头，还有多少个单词不属于这两类。为此，方法之一是，使用 `isalpha()` 来区分以字母和其他字符打头的单词，然后对于通过了 `isalpha()` 测试的单词，使用 `if` 或 `switch` 语句来确定哪些以元音打头。

该程序的运行情况如下：


```bash
Enter words (q to quit):
The 12 awesome oxen ambled
quietly across 15 meters of lawn. q

5 words beginning with vowels
4 words beginning with consonants
2 others

```

**解：**

```Cpp
#include <iostream>
#include <cctype>
#include <string>


int main() {

    using namespace std;

    unsigned int vowels = 0;
    unsigned int consonants = 0;
    unsigned int other = 0;
    string input;

    cout << "Enter words (q to quit): " << endl;
    while (cin >> input) {
        if (input == "q")
            break;

        if (isalpha(input[0])) {
            switch(toupper(input[0])) {

                case 'A':;
                case 'E':;
                case 'I':;
                case 'O':;
                case 'U':
                    ++vowels;
                    break;

                default:
                    ++consonants;
                    break;
            }
        } else {
            ++other;
        }
    }

    cout << vowels << " words beginning with vowels.\n"
         << consonants << " words beginning with consonants.\n"
         << other << " words beginning with other letter." << endl;

    return 0;
}

```


## 6.8

**题：** 编写一个程序，它打开一个文件文件，逐个字符地读取该文件，直到到达文件末尾，然后指出该文件中包含多少个字符。


**解：**

```Cpp
#include <iostream>
#include <fstream>
#include <string>


int main() {
    using namespace std;

    string fn;
    ifstream in_file_handle;

    unsigned int n = 0;
    char ch;

    cout << "Enter a file name: ";
    getline(cin, fn);

    in_file_handle.open(fn.c_str());
    while ((ch = in_file_handle.get()) != EOF) {
        ++n;
    }
    in_file_handle.close();

    cout << "There are " << n << " characters in " 
         << fn << " file." << endl;

    return 0;
}

```


## 6.9

**题：** 完成编程练习6，但从文件中读取所需的信息。该文件的第一项 应为捐款人数，余下的内容应为成对的行。在每一对中，第一行为捐款人姓名，第二行为捐款数额。即该文件类似于下面：

```bash
4 Sam Stone
2000
Freida Flass
100500
Tammy Tubbs
5000
Rich Raptor
55000
```

**解：**

```Cpp
#include <iostream>
#include <fstream>
#include <string>


int main() {

    using namespace std;
    const int Grand_Amount = 10000;
    string file_name; 
    ifstream in_file_handle;

    struct Patron {
        string name;
        double amount;
    };

    int contribute_num = 0;
    cout << "Enter a file name: ";

    getline(cin, file_name);
    in_file_handle.open(file_name.c_str());
    in_file_handle >> contribute_num;
    in_file_handle.get();  // 读取空白

    Patron *p_contribution = new Patron [contribute_num];
    for (int i = 0; i < contribute_num; ++i) {
        /*
         * 4 Sam Stone
         * 2000
         * Freida Flass
         * 100500
         * Tammy Tubbs
         * 5000
         * Rich Raptor
         * 55000
         *
         */
        getline(in_file_handle, p_contribution[i].name);
        in_file_handle >> p_contribution[i].amount;
        in_file_handle.get();   // 读掉空白(包括滞留在行末的回车符)
    }
    in_file_handle.close();

    unsigned int grand_amount_n = 0;
    cout << "\nGrand patron: " << endl;
    for (int i = 0; i < contribute_num; ++i) {

        if (p_contribution[i].amount > Grand_Amount) {
            cout << "Contributor name: " << p_contribution[i].name << "\n"
                 << "Contributor amount: " << p_contribution[i].amount << endl;
            ++grand_amount_n;
        }
    }

    if (grand_amount_n == 0) {
        cout << "None" << endl;
    }

    bool is_empty = true;
    cout << "\nPatrons: " << endl;
    for (int i=0; i < contribute_num; ++i) {
        cout << "Contributor name: " << p_contribution[i].name << "\n"
             << "Contributor amount: " << p_contribution[i].amount << endl;

        is_empty = false;
    }

    if (is_empty) {
        cout << "** None **" << endl;
    }

    delete [] p_contribution;
    return 0;
}


```

# 第七章 《函数——C++的编程模块》 编程练习题之我解

## 7.1

**题：** 编写一个程序，不断要求用户输入两个数，直到其中的一个为 0。对于每两个数，程序将使用一个函数来计算它们的调和平均数，
并将结果返回给 `main()``，而后者将报告结果。调和平均数指的是倒数平均值的倒数，计算公式如下:

调和平均数 = 2.0 * x * y / (x+y)

**解：**

```Cpp
#include <iostream>

int main() {
    using namespace std;

    double x = 0, y = 0;
    double h_avg = 0;

    cout << "Enter two numbers: ";
    cin >> x >> y;

    while (x != 0 && y != 0) {
        h_avg = 2 * x * y / (x+y);
        cout << "The harmonic mean of " << x << " and " << y << " is " << h_avg << endl;
        cout << "Enter the next two numbers: ";
        cin >> x >> y;
    }

    return 0;
}
```

## 7.2

**题：** 编写一个程序，要求用户输入最多10个高尔夫成绩，并将其存储在一个数组中。程序允许用户提早结束输入，并在一行上显示所有成绩，
然后报告平均成绩。请使用3个数组处理函数来分别进行输入、显示和计算平均成绩。

**解：**

```Cpp
#include <iostream>

int input(double data[], int max_num) {
    int i = 0;
    std::cout << "Enter up o 10 golf score (-1 to quit): " << std::endl;
    while (std::cin >> data[i]) {
        if (data[i] == -1) {
            --i;
            break;
        }
        ++i;

        if (i == max_num)
            break;
    }

    return (i < max_num) ? i+1 : max_num;
}

double calculate_average(const double data[], int n) {

    double sum = 0;
    for (size_t i(0); i < n; ++i) {
        sum += data[i];
    }

    return sum / n;
}

void output(const double data[], int n) {

    std::cout << "The score are: " << std::endl;
    for (size_t i(0); i < n; ++i) {
        std::cout << data[i] << " ";
    }
    std::cout << std::endl;
}

int main() {

    double glf_score[10];
    int n = input(glf_score, 10);
    double avg_score = calculate_average(glf_score, n);
    output(glf_score, n);
    std::cout << "The average is: " << avg_score << std::endl;
    return 0;
}
```

## 7.3

**题：** 下面是一个结构体的声明：

```Cpp
struct box {
    char maker[40];
    float height;
    float width;
    float length;
    float volume;
}
```

a. 编写一个函数，按值传递 `box` 结构体，并显示每个成员的值。
b. 编写一个函数，传递 `box` 结构体的地址，并将 volume 成员设置为其他三维长度的乘积。
c. 编写一个使用这两个函数的简单程序。

**解：**

```Cpp
#include <iostream>

typedef struct {
    char maker[40];
    float height;
    float width;
    float length;
    float volume;
} Box;

void output(Box bx) {
    std::cout << "Box maker: " << bx.maker << std::endl;
    std::cout << "Box height: " << bx.height << std::endl;
    std::cout << "Box width: " << bx.width << std::endl;
    std::cout << "Box length: " << bx.length << std::endl;
    std::cout << "Box volume: " << bx.volume << std::endl;
}

void calculate_volume(Box *p_bx) {
    p_bx->volume = p_bx->height * p_bx->width * p_bx->length;
}

int main() {
    Box bx = {"Jay", 0.49, 2.94, 0.49, 0.0};

    output(bx);
    calculate_volume(&bx);

    std::cout << "\n--\n";
    output(bx);

    return 0;
}
```

## 7.4

**题：** 许多彩票发行机构都使用如程序清单7.4所示的简单彩票玩法的变体。在这些玩法中，玩家从一组被称为域号码(field number)
的号码中选择几个。例如，可以从域号码1~47中选择5个号码; 还可以从第二个区间(如1~27)选择一个号码(称为特选号码)。要赢得头奖，必
须正确猜中所有的号码。中头奖的几率是选中所有域号码的几率与选中特选号码几率的乘积。例如，在这个例子中，中头奖的几率是从47个号码
中正确选取5个号码的几率与从27个号码中正确选择1个号码的几率的乘积。请修改程序清单7.4，以计算中得这种彩票头奖的几率。

**解：**

```Cpp
#include <iostream>

long double probability(unsigned numbers, unsigned picks) {
    long double result = 1.0;
    long double n;
    unsigned p;

    for (n = numbers, p = picks; p > 0; n--, p--) {
        result *= n/p;
    }

    return result;
}

int main() {

    unsigned int field1 = 47;
    unsigned int field2 = 27;

    std::cout << "You have no chance in "
              << probability(field1, 5) * probability(field2, 1)
              << " of winning.\n" << std::endl;
    return 0;
}
```

## 7.5

**题：** 定义一个递归函数，接受一个整数参数，并返回该参数的阶乘。

> 前面讲过，3的阶乘写作3!，等于3*2!，依此类推; 而 `0!` 被定义为1。通用的计算公式是，如果n大于零，则n!=n*(n−1)!。
在程序中对该函数进行测试，程序使用循环让用户输入不同的值，程序将报告这些值的阶乘。


**解：**

```Cpp
#include <iostream>

long factorial(int n) {

    if (n == 0) {
        return 1;
    }

    return n * factorial(n-1);
}


int main() {

    using namespace std;

    int n;
    cout << "Enter an integer number: ";
    while (!(cin >> n)) {
        cin.clear();
        while (cin.get() != '\n') {
            continue;
        }
        cout << "Please enter an integer number: ";
    }

    if (n < 0) {
        cout << "Negative number don't have factorial." << endl;
        exit(1);
    }

    long f = factorial(n);
    cout << "The factorial of " << n << " is " << f << endl;
    return 0;
}
```

## 7.6

**题：** 编写一个程序，它使用下列函数:

- `Fill_array()` 将一个 double 数组的名称和长度作为参数。它提示用户输入 double 值，并将这些值存储到数组中。
当数组被填满或用户输入了非数字时，输入将停止，并返回实际输入了多少个数字;
- `Show_array()` 将一个 double 数组的名称和长度作为参数，并显示该数组的内容;
- `Reverse-array()` 将一个 double 数组的名称和长度作为参数，并将存储在数组中的值的顺序反转。

程序将使用这些函数来填充数组，然后显示数组;反转数组，然后显示数组;反转数组中除第一个和最后一个元素之外的所有元素，然后显示数组。


**解：**

```Cpp
#include <iostream>

int Fill_array(double data[], int max_num) {

    std::cout << "Enter double numbers (non-digital to quit): " << std::endl;
    int i = 0;
    while ((i < max_num) && (std::cin >> data[i]))
        ++i;

    // return the size of array
    return i;
}

void Show_array(const double data[], int n) {

    std::cout << "The size of array is: " << n << " and the data is: ";
    for (size_t i(0); i < n; ++i) {
        std::cout << data[i] << " ";
    }
    std::cout << "\n";
}

void Reverse_array(double data[], int n) {

    for (size_t i(0); i < n/2; ++i) {
        double t = data[i];
        data[i] = data[n - 1 - i];
        data[n - 1 - i] = t;
    }

    return;
}

int main() {
    double data[10];
    int n = Fill_array(data, 10);
    Show_array(data, n);
    Reverse_array(data, n);
    Show_array(data, n);

    return 0;
}
```

# 第八章 《函数深探》 编程练习题之我解

## 8.1

**题：** 编写通常接受一个参数(字符串的地址)，并打印该字符串的函数。如果提供了第二个参数(int类型)，且该参数不为0，则该函数
打印字符串的次数将为该函数被调用的次数(注意，字符串的打印次数不等于第二个参数的值，而等于函数被调用的次数)。是的，这是一个非常可笑
的函数，但它让您能够使用本章介绍的一些技术。在一个简单的程序中使用该函数，以演示该函数是如何工作的。


## 8.2

**题：** CandyBar结构包含3个成员。第一个成员存储 `candy bar` 的品牌名称;第二个成员存储 `candy bar` 的重量(可能有小数);
第三个成员存储 `candy bar` 的热量(整数)。请编写一个程序，它使用一个这样的函数，即将 `CandyBar` 的引用、char指针、double
和 int 作为参数，并用最后3个值设置相应的结构成员。最后3个参数的默认值分别为 "Millennium Munch"、2.85和350。另外，该程序还
包含一个以 CandyBar 的引用为参数，并显示结构内容的函数。请尽可能使用 `const`。


## 8.3

**题：** 编写一个函数，它接受一个指向 `string` 对象的引用作为参数，并将该 `string` 对象的内容转换为大写，为此可使用表6.4描述
的函数 `toupper()`。然后编写一个程序，它通过使用一个循环让您能够用不同的输入来测试这个函数，该程序的运行情况如下:

```
 Enter a string (q to quit): gi away
 GO AWAY
 Next string (q to quit): good grief!
 GOOD GRIEF!
 Next string (q to quit): q
 Bye.
```

## 8.4

**题：** 下面是一个程序框架：

```Cpp
#include <iostream>
#include <cstring>

using namespace std;

struct stringy {
    char *str;
    int ct;
};

int main() {
    stringy beany;
    char testing[] = "Reality isn't what it used to be.";

    set(beany, testing);
    show(beany);
    show(beany, 2);
    testing[0] = 'D';
    testing[1] = 'u';
    show(testing);
    show(testing, 3);
    show("Done!");

    return 0;
}
```
请提供其中描述的函数和原型，从而完成该程序。注意，应有两个 `show()` 函数，每个都使用默认参数。请尽可能使用 `cosnt`参数。
`set()` 使用 `new` 分配足够的空间来存储指定的字符串。这里使用的技术与设计和实现类时使用的相似。(可能还必须修改头文件的名
称，删除using编译指令，这取决于所用的编译器。)


## 8.5

**题：** 编写模板函数 `max5()`，它将一个包含5个 T 类型元素的数组作为参数，并返回数组中最大的元素(由于长度固定，因此可以在循
环中使用硬编码，而不必通过参数来传递)。在一个程序中使用该函数，将 T 替换为一个包含5个 `int` 值的数组和一个包含5个 `double`
值的数组，以测试该函数。


## 8.6

**题：** 编写模板函数 `maxn()`，它将由一个 T 类型元素组成的数组和一个表示数组元素数目的整数作为参数，并返回数组中最大的元素。
在程序对它进行测试，该程序使用一个包含6个 int 元素的数组和一个包含4个 double 元素的数组来调用该函数。程序还包含一个具体化，它
将 char 指针数组和数组中的指针数量作为参数，并返回最长的字符串的地址。如果有多个这样的字符串，则返回其中第一个字符串的地址。使用
由5个字符串指针组成的数组来测试该具体化。


## 8.7

**题：** 修改程序清单 8.14，使其使用两个名为 `SumArray()` 的模板函数来返回数组元素的总和，而不是显示数组的内容。程序应显示
`thing`的总和以及所有 debt 的总和。


# 第九章 《内存模型和名字空间》 编程练习题之我解

## 9.1

**题：**下面是一个头文件

```cpp
const int Len = 40;
struct golf {
    char fullname[Len];
    int handicap;
};
void handicap(golf & g, int hc);
void showgolf(const golf & g);
int setgolf(golf & g);
```

注意到 setgolf() 被重载，可以这样使用其第一个版本：

```cpp
golf ann;
setgolf(ann, "Ann Birdfree", 24);
```

上述函数调用提供了存储在ann结构中的信息。可以这样使用其第二个版本:

```cpp
golf andy;
setgolf(andy);
```
上述函数将提示用户输入姓名和等级，并将它们存储在andy结构 中。这个函数可以(但是不一定必须)在内部使用第一个版本。
根据这个头文件，创建一个多文件程序。其中的一个文件名为 golf.cpp，它提供了与头文件中的原型匹配的函数定义;另一个文件应 包含main( )，并演示原型化函数的所有特性。例如，包含一个让用户输 入的循环，并使用输入的数据来填充一个由golf结构组成的数组，数组 被填满或用户将高尔夫选手的姓名设置为空字符串时，循环将结束。 main( )函数只使用头文件中原型化的函数来访问golf结构。

## 9.2

**题：** 修改程序清单9.9:用string对象代替字符数组。这样，该程序将 不再需要检查输入的字符串是否过长，同时可以将输入字符串同字符 串“”进行比较，以判断是否为空行。


## 9.3

**题：** 下面是一个结构声明:

```cpp
struct chaff {
    char dross[20];
    int slag;
};
```

编写一个程序，使用定位new运算符将一个包含两个这种结构的数 组放在一个缓冲区中。然后，给结构的成员赋值(对于char数组，使用函数 strcpy( ))，并使用一个循环来显示内容。一种方法是像程序清单 9.10那样将一个静态数组用作缓冲区;另一种方法是使用常规new运算 符来分配缓冲区。

## 9.4

**题：** 4.请基于下面这个名称空间编写一个由3个文件组成的程序:

```cpp
namespace SAIGES {
    const int QUARTERS = 4;
    struct Sales {
        double sales[QUARTERS];
        double average;
        double max;
        double min;
    };
    void setSales(Sales &s, const double ar[], int n);
    void setSales(Sales &s);
    void showSales(const Sales &s);
}
```
第一个文件是一个头文件，其中包含名称空间; 第二个文件是一个 源代码文件，它对这个名称空间进行扩展，以提供这三个函数的定义; 第三个文件声明两个Sales对象，并使用 `setSales()` 的交互式版本为一个 结构提供值，然后使用 `setSales()` 的非交互式版本为另一个结构提供值。 另外它还使用 `showSales()` 来显示这两个结构的内容。

# 第十章 《对象和类》 编程练习题之我解

## 10.1 

**题：** 为复习题5描述的类提供方法定义，并编写一个小程序来演示所 有的特性。

> 复习题5：定义一个类来表示银行帐户。数据成员包括储户姓名、账号 (使用字符串)和存款。成员函数执行如下操作:
>
> * 创建一个对象并将其初始化;
> * 显示储户姓名、账号和存款;
> * 存入参数指定的存款;
> * 取出参数指定的款项。

## 10.2 

**题：** 下面是一个非常简单的类定义:

```cpp
class Person {
private:
    // static const LIMIT = 25 编译报错，C++不支持默认int
    static const int LIMIT = 25;
    string lname;
    char fname[LIMIT];
 
public:
    Person() { lname = ""; fname[0] = '\0'; }  // #1
    Person(const string & ln, const char * fn = "Heyyou");  // #2
    void Show() const;
    void FormalShow() const;
};
```

它使用了一个string对象和一个字符数组，让您能够比较它们的用 法。请提供未定义的方法的代码，以完成这个类的实现。再编写一个使 用这个类的程序，它使用了三种可能的构造函数调用(没有参数、一个 参数和两个参数)以及两种显示方法。下面是一个使用这些构造函数和 方法的例子:

```cpp
Person one;                     // default constructor
Person two("Smythecraft");      // use #2 with one default argument
Person three("Dimwidy", "Sam"); // use #2 with no defaults.

one.show();
cout << endl;
one.FormalShow();
```

## 10.3

**题：** 3.完成第9章的编程练习1，但要用正确的golf类声明替换那里的代 码。用带合适参数的构造函数替换 `setgolf(golf &, const char *, int)`， 以提供初始值。保留`setgolf( )` 的交互版本，但要用构造函数来实现它 (例如，`setgolf( )` 的代码应该获得数据，将数据传递给构造函数来创建 一个临时对象，并将其赋给调用对象，即`*this`)。



## 10.4

**题：** 完成第9章的编程练习4，但将Sales结构及相关的函数转换为一个类及其方法。用构造函数替换 `setSales(sales &，double [ ]，int)` 函数。用构造函数实现 `setSales(Sales &)` 方法的交互版本。将类保留在名称空间SALES中。



## 10.5

**题：** 考虑下面的结构声明:

```cpp
struct customer {
    char fullname[35];
    double payment;
}
```

编写一个程序，它从栈中添加和删除 `customer` 结构(栈用 `Stack` 类声明表示)。每次 `customer` 结构被删除时，其 `payment` 的值都被加入到总数中，并报告总数。

> 注意: 应该可以直接使用 `Stack` 类而不作修改;只需修改 `typedef` 声明，使 `Item` 的类型为 `customer`，而不是 `unsigned long` 即可。

## 10.6

下面是一个类声明:

```cpp
class Move {
private:
    double x;
    double y;
public:
    Move(double a=0, double b = 0);
    showmove() const;
    Move add(const Move &m) const:
    reset(double a = 0, double b = 0);
}
```

请提供成员函数的定义并测试这个类的测序。

## 10.7

**题：** Betelgeusean plorg有这些特征。

数据：

* plorg的名称不超过19个字符;
* plorg有满意指数(CI)，这是一个整数。

操作：

* 新的plorg将有名称，其CI值为50;
* plorg的CI可以修改;
* plorg可以报告其名称和CI;
* plorg的默认名称为“Plorga”。

请编写一个 `Plorg` 类声明(包括数据成员和成员函数原型)来表示 `plorg`，并编写成员函数的函数定义。然后编写一个小程序，以演示 `Plorg` 类的所有特性。

## 10.8

**题：** 可以将简单列表描述成下面这样:

* 可存储0或多个某种类型的列表;
* 可创建空列表;
* 可在列表中添加数据项;
* 可确定列表是否为空;
* 可确定列表是否为满; 可访问列表中的每一个数据项，并对它执行某种操作。

```
可以看到，这个列表确实很简单，例如，它不允许插入或删除数据
项。
```

请设计一个List类来表示这种抽象类型。您应提供头文件list.h和实 现文件list.cpp，前者包含类定义，后者包含类方法的实现。您还应创建 一个简短的程序来使用这个类。

该列表的规范很简单，这主要旨在简化这个编程练习。可以选择使用数组或链表来实现该列表，但公有接口不应依赖于所做的选择。也就是说，公有接口不应有数组索引、节点指针等。应使用通用概念来表达创建列表、在列表中添加数据项等操作。对于访问数据项以及执行操作，通常应使用将函数指针作为参数的函数来处理:

```cpp
void visit(void (*pf)(Item &));
```

其中，pf指向一个将Item引用作为参数的函数(不是成员函数)，Item是列表中数据项的类型。`visit()` 函数将该函数用于列表中的每个数据项。


# 第11章 《使用类》 编程练习题之我解

## 11.1

**题** 修改程序清单11.5，使之将一系列连续的随机漫步者位置写入 到文件中。对于每个位置，用步号进行标示。另外，让该程序将初始条 件(目标距离和步长)以及结果小结写入到该文件中。该文件的内容与 下面类似:

![](https://s3.zmingu.com/images/2025/05/eae940acd9d156a22f7d1655bb2c228b_MD5.webp)

## 11.2

**题：** 对Vector类的头文件(程序清单11.13)和实现文件(程序清单 11.14)进行修改，使其不再存储矢量的长度和角度，而是在magval( )和 angval( )被调用时计算它们。

应保留公有接口不变(公有方法及其参数不变)，但对私有部分 (包括一些私有方法)和方法实现进行修改。然后，使用程序清单 11.15对修改后的版本进行测试，结果应该与以前相同，因为Vector类的 公有接口与原来相同。

## 11.3

**题：** 修改程序清单11.15，使之报告N次测试中的最高、最低和平均 步数(其中N是用户输入的整数)，而不是报告每次测试的结果。

## 11.4

**题：** 重新编写最后的Time类示例(程序清单11.10、程序清单11.11和 程序清单11.12)，使用友元函数来实现所有的重载运算符。

## 11.5 

**题：** 重新编写Stonewt类(程序清单11.16和程序清单11.17)，使它 有一个状态成员，由该成员控制对象应转换为英石格式、整数磅格式还 是浮点磅格式。重载<<运算符，使用它来替换show_stn( )和show_lbs( ) 方法。重载加法、减法和乘法运算符，以便可以对Stonewt值进行加、 减、乘运算。编写一个使用所有类方法和友元的小程序，来测试这个类。



## 11.6

**题：** 重新编写Stonewt类(程序清单11.16和程序清单11.17)，重载 全部6个关系运算符。运算符对pounds成员进行比较，并返回一个bool 值。编写一个程序，它声明一个包含6个Stonewt对象的数组，并在数组 声明中初始化前3个对象。然后使用循环来读取用于设置剩余3个数组元 素的值。接着报告最小的元素、最大的元素以及大于或等于11英石的元 素的数量(最简单的方法是创建一个Stonewt对象，并将其初始化为11 英石，然后将其同其他对象进行比较)。

## 11.7

**题：** 复数有两个部分组成:实数部分和虚数部分。复数的一种书写 方式是:(3.0，4.0)，其中，3.0是实数部分，4.0是虚数部分。假设a = (A, Bi)，c = (C, Di)，则下面是一些复数运算。

* 加法: `a + c = (A+C, (B+D)i)`;
* 减法: `a – c = (A−C, (B−D)i)`;
* 乘法: `a * c = (A*C−B*D, (A*D + B*C)i)`;
* 乘法:: `x*c = (x * C, x *Di)`，其中 `x` 为实数;
* 共轭: `~a = (A, −Bi)`。

请定义一个复数类，以便下面的程序可以使用它来获得正确的结果。

![](https://s3.zmingu.com/images/2025/05/c19c05beb30b0185b36a20a037ab4bf1_MD5.webp)

![](https://s3.zmingu.com/images/2025/05/2231fc2c0e3a6c21f65b2651e3b70c63_MD5.webp)

![](https://s3.zmingu.com/images/2025/05/e0a466a976db875dd96d491f8632e042_MD5.webp)

注意，必须重载运算符<<和>>。标准C++使用头文件complex提供 了比这个示例更广泛的复数支持，因此应将自定义的头文件命名为 complex0.h，以免发生冲突。应尽可能使用const。

下面是该程序的运行情况。

![](https://s3.zmingu.com/images/2025/05/6518e22a54bb7f5e180ff019d344f2fc_MD5.webp)

请注意，经过重载后，cin >>c将提示用户输入实数和虚数部分。

# 第九章 《类和动态内存分配》 编程练习题之我解

## 12.1

**题：** 对于下面的类声明：

![](https://s3.zmingu.com/images/2025/05/6ce1722c5992d6306eb3f5614c684ab6_MD5.webp)

给这个类提供实现，并编写一个使用所有成员函数的小程序。

## 12.2

**题：** 通过完成下面的工作来改进String类声明(即将String1.h升级为String2.h)。

a.对+运算符进行重载，使之可将两个字符串合并成1个。

b.提供一个Stringlow( )成员函数，将字符串中所有的字母字符转 换为小写(别忘了cctype系列字符函数)。

c.提供String( )成员函数，将字符串中所有字母字符转换成大写。 d.提供一个这样的成员函数，它接受一个char参数，返回该字符在字符串中出现的次数。使用下面的程序来测试您的工作:

![](https://s3.zmingu.com/images/2025/05/507bf78c85b98e92fa80043e6b2fca47_MD5.webp)

![](https://s3.zmingu.com/images/2025/05/c8ea088cf85bd4cc373a6b54c8130b80_MD5.webp)

输出应与下面相似:

![](https://s3.zmingu.com/images/2025/05/f2603f638fe850f68a6ef35727f2c725_MD5.webp)

## 10.3 

**题：** 新编写程序清单10.7和程序清单10.8描述的Stock类，使之使用动态分配的内存，而不是 `string` 类对象来存储股票名称。另外，使用重 载的 `operator<<()`定义代替 `show()` 成员函数。再使用程序清单10.9测试新 的定义程序。



## 10.4 

**题：** 请看下面程序清单10.10定义的Stack类的变量:

![](https://s3.zmingu.com/images/2025/05/3a284e7aacd619cb95322da6d6474092_MD5.webp)

正如私有成员表明的，这个类使用动态分配的数组来保存栈项。请重新编写方法，以适应这种新的表示法，并编写一个程序来演示所有的方法，包括复制构造函数和赋值运算符。



## 10.5 

**题：** Heather银行进行的研究表明，ATM客户不希望排队时间不超过 1分钟。使用程序清单12.10中的模拟，找出要使平均等候时间为1分钟，每小时到达的客户数应为多少(试验时间不短于100小时)?



## 10.6 

**题：** Heather银行想知道，如果再开设一台ATM，情况将如何。请对 模拟进行修改，以包含两个队列。假设当第一台ATM前的排队人数少 于第二台ATM时，客户将排在第一队，否则将排在第二队。然后再找 出要使平均等候时间为1分钟，每小时到达的客户数应该为多少(注 意，这是一个非线性问题，即将ATM数量加倍，并不能保证每小时处 理的客户数量也翻倍，并确保客户等候的时间少于1分钟)?

# 第13章 《类继承 》 编程练习题之我解

## 13.1

**题：** 以下面的类声明为基础：

![](https://s3.zmingu.com/images/2025/05/6f821aa83818f8b3137ef647fa695a5a_MD5.webp)

派生出一个Classic类，并添加一组char成员，用于存储指出CD中主 要作品的字符串。修改上述声明，使基类的所有函数都是虚的。如果上 述定义声明的某个方法并不需要，则请删除它。使用下面的程序测试您 的产品:

![](https://s3.zmingu.com/images/2025/05/e856271c25ea5d0496348cd2019c6b3c_MD5.webp)

![](https://s3.zmingu.com/images/2025/05/240de92e5578022ca2a6b329f548a6db_MD5.webp)

## 13.2

**题：** 完成练习1，但让两个类使用动态内存分配而不是长度固定的数组来记录字符串。

## 13.3

**题：** 修改baseDMA-lacksDMA-hasDMA类层次，让三个类都从一个 ABC派生而来，然后使用与程序清单13.10相似的程序对结果进行测 试。也就是说，它应使用ABC指针数组，并让用户决定要创建的对象类 型。在类定义中添加virtual View( )方法以处理数据显示。

## 13.4

**题：** Benevolent Order of Programmers用来维护瓶装葡萄酒箱。为描 述它，BOP Portmaster设置了一个Port类，其声明如下:

![](https://s3.zmingu.com/images/2025/05/68e1c696ea7254f44b752d2a29d1bc6e_MD5.webp)

show( )方法按下面的格式显示信息:

![](https://s3.zmingu.com/images/2025/05/fe1a253622d127522ac322958b5ea703_MD5.webp)

`operator<<()` 函数按下面的格式显示信息(末尾没有换行符):

![](https://s3.zmingu.com/images/2025/05/9a5dcac79f93c10032babf665cdb8bc9_MD5.webp)

PortMaster完成了Port类的方法定义后派生了VintagePort类，然后被 解职——因为不小心将一瓶45度Cockburn泼到了正在准备烤肉调料的人 身上，VintagePort类如下所示:

![](https://s3.zmingu.com/images/2025/05/d596e154832025afad4e112a573146f6_MD5.webp)

您被指定负责完成VintagePort。

a.第一个任务是重新创建Port方法定义，因为前任被开除时销毁了方法定义。

b.第二个任务是解释为什么有的方法重新定义了，而有些没有重 新定义。

c.第三个任务是解释为何没有将operator=( )和operator<<( )声明为虚的。

d.第四个任务是提供VintagePort中各个方法的定义。


# 第14章 《C++中的代码重用 》 编程练习题之我解

## 14.1 

**题：** Wine类有一个string类对象成员(参见第4章)和一个Pair对象 (参见本章);其中前者用于存储葡萄酒的名称，而后者有2个 `valarray<int>`对象(参见本章)，这两个`valarray<int>`对象分别保存了葡 萄酒的酿造年份和该年生产的瓶数。例如，Pair的第1个valarray`<int>`对 象可能为1988、1992和1996年，第2个`valarray<int>`对象可能为24、48和 144瓶。Wine最好有1个int成员用于存储年数。另外，一些typedef可能 有助于简化编程工作:

![](https://s3.zmingu.com/images/2025/05/3945671aaa3a85d56b39b9baf8b58315_MD5.webp)

这样，`PairArray` 表示的是类型 `Pair<std::valarray<int>, std::valarray<int> >`。使用包含来实现 `Wine` 类，并用一个简单的程序对其 进行测试。`Wine` 类应该有一个默认构造函数以及如下构造函数:

![](https://s3.zmingu.com/images/2025/05/b27446b5aa93930ec5986182186ed97e_MD5.webp)

Wine类应该有一个 `GetBottles()` 方法，它根据Wine对象能够存储几种年份(y)，提示用户输入年份和瓶数。方法 `Label()` 返回一个指向葡 萄酒名称的引用。`sum()` 方法返回 `Pair` 对象中第二个 `valarray<int>` 对象中的瓶数总和。

测试程序应提示用户输入葡萄酒名称、元素个数以及每个元素存储 的年份和瓶数等信息。程序将使用这些数据来构造一个 `Wine` 对象，然后 显示对象中保存的信息。

下面是一个简单的测试程序:

![](https://s3.zmingu.com/images/2025/05/d5d2d6e0cd6e417914d263e5c6d84672_MD5.webp)

下面是该程序的运行情况:

![](https://s3.zmingu.com/images/2025/05/2285f644308421ac19f194d6fc2d02db_MD5.webp)

## 14.2 

**题：** 采用私有继承而不是包含来完成编程练习1。同样，一些typedef 可能会有所帮助，另外，您可能还需要考虑诸如下面这样的语句的含义:

![](https://s3.zmingu.com/images/2025/05/d80762e9b705ca7a166ada867c7a19bd_MD5.webp)

您设计的类应该可以使用编程练习1中的测试程序进行测试。

## 14.3 

**题：** 定义一个QueueTp模板。然后在一个类似于程序清单14.12的程 序中创建一个指向Worker的指针队列(参见程序清单14.10中的定 义)，并使用该队列来测试它。

## 14.4

**题：** Person类保存人的名和姓。除构造函数外，它还有Show( )方 法，用于显示名和姓。Gunslinger类以Person类为虚基类派生而来，它包 含一个Draw( )成员，该方法返回一个double值，表示枪手的拔枪时间。 这个类还包含一个int成员，表示枪手枪上的刻痕数。最后，这个类还包 含一个Show( )函数，用于显示所有这些信息。

PokerPlayer类以Person类为虚基类派生而来。它包含一个Draw()成 员，该函数返回一个1~52的随机数，用于表示扑克牌的值(也可以定 义一个Card类，其中包含花色和面值成员，然后让Draw( )返回一个Card 对象)。PokerPlayer类使用Person类的show( )函数。BadDude( )类从 Gunslinger和PokerPlayer类公有派生而来。它包含Gdraw( )成员(返回坏 蛋拔枪的时间)和Cdraw( )成员(返回下一张扑克牌)，另外还有一个 合适的Show( )函数。请定义这些类和方法以及其他必要的方法(如用于 设置对象值的方法)，并使用一个类似于程序清单14.12的简单程序对 它们进行测试。

## 14.5 

**题：** 下面是一些类声明:

![](https://s3.zmingu.com/images/2025/05/5573ec3b799068744beb0bbbab6c9ebc_MD5.webp)

![](https://s3.zmingu.com/images/2025/05/cf2b881ede56e43eea949b69519f5c09_MD5.webp)

![](https://s3.zmingu.com/images/2025/05/672786e11c192482d15d9efcf43f7f60_MD5.webp)

注意，该类层次结构使用了带虚基类的MI，所以要牢记这种情况 下用于构造函数初始化列表的特殊规则。还需要注意的是，有些方法被 声明为保护的。这可以简化一些highfink方法的代码(例如，如果 highfink::ShowAll( )只是调用fink::ShowAll( )和manager::ShwAll( )，则它 将调用abstr_emp::ShowAll( )两次)。请提供类方法的实现，并在一个程 序中对这些类进行测试。下面是一个小型测试程序:

![](https://s3.zmingu.com/images/2025/05/1eb0e532e45525ed50c54d42be1c783f_MD5.webp)

![](https://s3.zmingu.com/images/2025/05/2f4ac21461fbac9c4a6d765224262972_MD5.webp)

* 为什么没有定义赋值运算符? 
* 为什么要将 `ShowAll()` 和 `SetAll()` 定义为虚的? 
* 为什么要将 `abstr_emp` 定义为虚基类? 
* 为什么 `highfink` 类没有数据部分? 
* 为什么只需要一个`operator<<()`版本?

如果使用下面的代码替换程序的结尾部分，将会发生什么情况?

![](https://s3.zmingu.com/images/2025/05/9b504fcaa01ec17bccb2a824f3ce1991_MD5.webp)

# 第15章 《友元、异常和其他》 编程练习题之我解

## 15.1

**题：** 对Tv和Remote类做如下修改: 

a. 让它们互为友元; b.在Remote类中添加一个状态变量成员，该成员描述遥控器是处于常规模式还是互动模式;

c. 在Remote中添加一个显示模式的方法;

d. 在Tv类中添加一个对Remote中新成员进行切换的方法，该方法 应仅当TV处于打开状态时才能运行。

编写一个小程序来测试这些新特性。

## 15.2 

**题：** 修改程序清单15.11，使两种异常类型都是从头文件 `<stdexcept>` 提供的`logic_error` 类派生出来的类。让每个 `what()` 方法都报告函数名和问题的性质。异常对象不用存储错误的参数值，而只需支持 `what()` 方法。



## 15.3

**题：** 这个练习与编程练习2相同，但异常类是从一个这样的基类派生 而来的:它是从logic_error派生而来的，并存储两个参数值。异常类应 该有一个这样的方法:报告这些值以及函数名。程序使用一个catch块来 捕获基类异常，其中任何一种从该基类异常派生而来的异常都将导致循 环结束。

## 15.4

**题：** 程序清单15.16在每个try后面都使用两个catch块，以确保 nbad_index异常导致方法label_val( )被调用。请修改该程序，在每个try 块后面只使用一个catch块，并使用RTTI来确保合适时调用label_val( )。


# 第16章 《string类和标准模板库》 编程练习题之我解

## 16.1

**题：**回文指的是顺读和逆读都一样的字符串。例如，“tot”和“otto”都 是简短的回文。编写一个程序，让用户输入字符串，并将字符串引用传 递给一个bool函数。如果字符串是回文，该函数将返回true，否则返回 false。此时，不要担心诸如大小写、空格和标点符号这些复杂的问题。 即这个简单的版本将拒绝“Otto”和“Madam，I'm Adam”。请查看附录F中 的字符串方法列表，以简化这项任务。



## 16.2 

**题：** 与编程练习1中给出的问题相同，但要考虑诸如大小写、空格和 标点符号这样的复杂问题。即“Madam，I'm Adam”将作为回文来测试。 例如，测试函数可能会将字符串缩略为“madamimadam”，然后测试倒过 来是否一样。不要忘了有用的cctype库，您可能从中找到几个有用的 STL函数，尽管不一定非要使用它们。

## 16.3

**题：** 修改程序清单16.3，使之从文件中读取单词。一种方案是，使用`vector<string>`对象而不是string数组。这样便可以使用push_back( )将 数据文件中的单词复制到`vector<string>`对象中，并使用size( )来确定单词列表的长度。由于程序应该每次从文件中读取一个单词，因此应使用 运算符>>而不是getline( )。文件中包含的单词应该用空格、制表符或换 行符分隔。



## 16.4

**题：** 编写一个具有老式风格接口的函数，其原型如下:

```cpp
int reduce(long arr[], int n);
```

实参应是数组名和数组中的元素个数。该函数对数组进行排序，删 除重复的值，返回缩减后数组中的元素数目。请使用STL函数编写该函 数(如果决定使用通用的unique( )函数，请注意它将返回结果区间的结 尾)。使用一个小程序测试该函数。



## 16.5

**题：** 问题与编程练习4相同，但要编写一个模板函数:

```cpp
template <class T>
int reduce(T arr[], int n)
```

在一个使用long实例和string实例的小程序中测试该函数。



## 16.6

**题：** 使用STL queue模板类而不是第12章的Queue类，重新编写程序清单12.12所示的示例。



## 16.7 

**题：** 彩票卡是一个常见的游戏。卡片上是带编号的圆点，其中一些 圆点被随机选中。编写一个lotto( )函数，它接受两个参数。第一个参数 是彩票卡上圆点的个数，第二个参数是随机选择的圆点个数。该函数返 回一个`vector<int>`对象，其中包含(按排列后的顺序)随机选择的号 码。例如，可以这样使用该函数:

```cpp
vector<int> winners;
winners = Lotto(51, 6);
```

这样将把一个矢量赋给winner，该矢量包含1~51中随机选定的6个 数字。注意，仅仅使用rand( )无法完成这项任务，因它会生成重复的 值。提示:让函数创建一个包含所有可能值的矢量，使用 random_shuffle( )，然后通过打乱后的矢量的第一个值来获取值。编写 一个小程序来测试这个函数。



## 16.8 

**题：** Mat和Pat希望邀请他们的朋友来参加派对。他们要编写一个程 序完成下面的任务。

* 让Mat输入他朋友的姓名列表。姓名存储在一个容器中，然后按排 列后的顺序显示出来。 
* 让Pat输入她朋友的姓名列表。姓名存储在另一个容器中，然后按 排列后的顺序显示出来。 
* 创建第三个容器，将两个列表合并，删除重复的部分，并显示这个 容器的内容。

## 16.9

**题：** 相对于数组，在链表中添加和删除元素更容易，但排序速度更 慢。这就引出了一种可能性:相对于使用链表算法进行排序，将链表复 制到数组中，对数组进行排序，再将排序后的结果复制到链表中的速度 可能更快;但这也可能占用更多的内存。请使用如下方法检验上述假设。

* a.创建大型 `vector<int>` 对象 `vi0`，并使用 `rand()` 给它提供初始值。 
* b.创建 `vector<int>` 对象 `vi` 和 `list<int>` 对象 `li`，它们的长度都和初始值与 `vi0` 相同。
* c.计算使用STL算法 `sort()` 对 `vi` 进行排序所需的时间，再计算使用list的方法 `sort()` 对li进行排序所需的时间。 
* d.将li重置为排序的 `vi0` 的内容，并计算执行如下操作所需的时间: 将li的内容复制到 `vi` 中，对 `vi` 进行排序，并将结果复制到 `li` 中。

要计算这些操作所需的时间，可使用 `ctime` 库中的 `clock()`。正如程序清单5.14演示的，可使用下面的语句来获取开始时间:

```cpp
clock_t start = clock();
```

再在操作结束后使用下面的语句获取经过了多长时间:

```cpp
clock_t end = clock();
cout << (double)(end- start) / CLOCKS_PER_SEC;
```

这种测试并非绝对可靠，因为结果取决于很多因素，如可用内存量、是否支持多处理以及数组(列表)的长度(随着要排序的元素数增 加，数组相对于列表的效率将更明显)。另外，如果编译器提供了默认 生成方式和发布生成方式，请使用发布生成方式。鉴于当今计算机的速 度非常快，要获得有意义的结果，可能需要使用尽可能大的数组。例 如，可尝试包含100000、1000000和10000000个元素。

## 16.10

**题：** 请按如下方式修改程序清单16.9(vect3.cpp)。

a. 在结构 `Review` 中添加成员 `price`。

b. 不使用 `vector<Review>` 来存储输入，而使用 `vector<shared_ptr<Review> >`。别忘了，必须使用 `new` 返回的指针来初始化 `shared_ptr` 。

c. 在输入阶段结束后，使用一个循环让用户选择如下方式之一显示书籍:按原始顺序显示、按字母表顺序显示、按评级升序显示、按评 级降序显示、按价格升序显示、按价格降序显示、退出。

下面是一种可能的解决方案:获取输入后，再创建一个 `shared_ptr` 矢量，并用原始数组初始化它。定义一个对指向结构的指针进行比较的 `operator < ()` 函数，并使用它对第二个矢量进行排序，让其中的 `shared_ptr` 按其指向的对象中的书名排序。重复上述过程，创建按 `rating` 和 `price` 排序的 `shared_ptr` 矢量。请注意，通过使用 `rbegin()` 和 `rend()`，可避 免创建按相反的顺序排列的 `shared_ptr` 矢量。


# 第17章 《输入、输出和文件》 编程练习题之我解

## 17.1

**题：** 编写一个程序计算输入流中第一个 `$` 之前的字符数目，并将 `$` 留在输入流中。

## 17.2

**题：** 编写一个程序，将键盘输入(直到模拟的文件尾)复制到通过 命令行指定的文件中。

## 17.3

**题：** 编写一个程序，将一个文件复制到另一个文件中。让程序通过 命令行获取文件名。如果文件无法打开，程序将指出这一点。

## 17.4

**题：** 编写一个程序，它打开两个文本文件进行输入，打开一个文本 文件进行输出。该程序将两个输入文件中对应的行并接起来，并用空格 分隔，然后将结果写入到输出文件中。如果一个文件比另一个短，则将 较长文件中余下的几行直接复制到输出文件中。例如，假设第一个输入 文件的内容如下:

![](https://s3.zmingu.com/images/2025/05/68ddd81b94888f9e78cb9a4289caa663_MD5.webp)


而第二个输入文件的内容如下:

![](https://s3.zmingu.com/images/2025/05/7db91fdfa412b6be5b8ea3221247b61f_MD5.webp)

则得到的文件的内容将如下:

![](https://s3.zmingu.com/images/2025/05/bdfba2b9432c3b0eec177b4d96d9b437_MD5.webp)

## 17.5

**题：** Mat和Pat想邀请他们的朋友来参加派对，就像第16章中的编程 练习8那样，但现在他们希望程序使用文件。他们请您编写一个完成下述任务的程序。

* 从文本文件mat.dat中读取Mat朋友的姓名清单，其中每行为一个朋 友。姓名将被存储在容器，然后按顺序显示出来。 
* 从文本文件pat.dat中读取Pat朋友的姓名清单，其中每行为一个朋 友。姓名将被存储在容器中，然后按顺序显示出来。 
* 合并两个清单，删除重复的条目，并将结果保存在文件matnpat.dat 中，其中每行为一个朋友。

## 17.6

**题：** 考虑14章的编程练习5中的类定义。如果还没有完成这个练习， 请现在就做，然后完成下面的任务。

编写一个程序，它使用标准C++ I/O、文件I/O以及14章的编程练习 5中定义的employee、manager、fink和highfink类型的数据。该程序应包 含程序清单17.17中的代码行，即允许用户将新数据添加到文件中。该 程序首次被运行时，将要求用户输入数据，然后显示所有的数据，并将 这些信息保存到一个文件中。当该程序再次被运行时，将首先读取并显 示文件中的数据，然后让用户添加数据，并显示所有的数据。差别之一 是，应通过一个指向employee类型的指针数组来处理数据。这样，指针 可以指向employee对象，也可以指向从employee派生出来的其他三种对 象中的任何一种。使数组较小有助于检查程序，例如，您可能将数组限 定为最多包含10个元素:

![](https://s3.zmingu.com/images/2025/05/7ad4898d080b53fdec3c890535860d67_MD5.webp)

为通过键盘输入，程序应使用一个菜单，让用户选择要创建的对象 类型。菜单将使用一个switch，以便使用new来创建指定类型的对象， 并将它的地址赋给pc数组中的一个指针。然后该对象可以使用虚函数 setall( )来提示用户输入相应的数据:

```cpp
pc[i]->setall(); 
```

为将数据保存到文件中，应设计一个虚函数 `writeall()`:

```cpp
for(i=0; i<index; i++)
    pc[i]->writeall(fout);
```

> 对于这个练习，应使用文本I/O，而不是二进制I/O(遗憾的是，虚对象包含指向虚函数指针表 的指针，而write( )将把这种信息复制到文件中。使用read( )读取文件的内容，以填充对象时， 函数指针值将为乱码，这将扰乱虚函数的行为)。可使用换行符将字段分隔开，这样在输入 时将很容易识别各个字段。也可以使用二进制I/O，但不能将对象作为一个整体写入，而应该 提供分别对每个类成员应用write( )和read( )的类方法。这样，程序将只把所需的数据保存到文 件中。

比较难处理的部分是使用文件恢复数据。问题在于:程序如何才能 知道接下来要恢复的项目是employee对象、manager对象、fink对象还是 highfink对象?一种方法是，在对象的数据写入文件时，在数据前面加 上一个指示对象类型的整数。这样，在文件输入时，程序便可以读取该 整数，并使用switch语句创建一个适当的对象来接收数据:

![](https://s3.zmingu.com/images/2025/05/9d7c327d5e0bf0ac440b8f112bcd5729_MD5.webp)

然后便可以使用指针调用虚函数getall( )来读取信息:

```cpp
pc[i++]->getall();
```

## 17.7

**题：** 下面是某个程序的部分代码。该程序将键盘输入读取到一个由 string对象组成的vector中，将字符串内容(而不是string对象)存储到一个文件中，然后该文件的内容复制到另一个由string对象组成的vector 中。

![](https://s3.zmingu.com/images/2025/05/7f3a545276f2603de962c7f48b2757ca_MD5.webp)

该程序以二进制格式打开文件，并想使用read( )和write( )来完成 I/O。余下的工作如下所述。

* 编写函数void ShowStr(const string &)，它显示一个string对象，并在 显示完后换行。

* 编写函数符Store，它将字符串信息写入到文件中。Store的构 造函数应接受一个指定 `ifstream` 对象的参数，而重载的 `operator( ) (const string &)`应指出要写入到文件中的字符串。一种可行的计划 是，首先将字符串的长度写入到文件中，然后将字符串的内容写入 到文件中。例如，如果len存储了字符串的长度，可以这样做:

    成员函数 data() 返回一个指针，该指针指向一个其中存储了字符串中字符的数组。它类似于成员函数 `c_str()`，只是后者在数组末尾加上了一个空字符。

* 编写函数 `GetStrs()`，它根据文件恢复信息。该函数可以使用 `read()` 来获得字符串的长度，然后使用一个循环从文件中读取相应数量的字符，并将它们附加到一个原来为空的临时 string 末尾。由于 string 的数据是私有的，因此必须使用 string 类的方法来将数据存储到 string 对象中，而不能直接存储。

# 第18章 《探讨C++新标准》 编程练习题之我解

## 18.1

**题：** 下面是一个简短程序的一部分:

![](https://s3.zmingu.com/images/2025/05/40b58583d77bc2085e6485ffd1fabb64_MD5.webp)

请提供函数average_list( )，让该程序变得完整。它应该是一个模板 函数，其中的类型参数指定了用作函数参数的initilize_list模板的类型以 及函数的返回类型。

## 18.2 

**题：** 下面是类Cpmv的声明:

![](https://s3.zmingu.com/images/2025/05/7c2bc4ea7a456f1f2f86b4f9eb9e6c78_MD5.webp)

函数operator+ ( )应创建一个对象，其成员qcode和zcode有操作数的 相应成员拼接而成。请提供为移动构造函数和移动赋值运算符实现移动 语义的代码。编写一个使用所有这些方法的程序。为方便测试，让各个 方法都显示特定的内容，以便知道它们被调用。



## 18.3 

**题：** 编写并测试可变参数模板函数 `sum_value()`，它接受任意长度的参数列表(其中包含数值，但可以是任何类型)，并以long double的方 式返回这些数值的和。



## 18.4 

**题：** 使用 `lambda` 重新编写程序清单16.5。具体地说，使用一个有名称的 `lambda` 替换函数 `outint()`，并将函数符替换为两个匿名 `lambda` 表达式。
