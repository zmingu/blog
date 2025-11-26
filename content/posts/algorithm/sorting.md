---
title: 排序算法
subtitle:
date: 2024-09-03 17:07:25 +08:00
slug: sorting
draft: false
description:
keywords:
  - 排序算法
tags:
  - 算法
categories:
  - 算法
summary: 排序算法记录
toc: true
---

## 排序
{{< details summary="①冒泡排序（Bubble Sort）" >}}
- 核心思想 : 循环遍历前后两个数并比较，如果前面大后面小就交换两个数
 ![image.gif](https://s3.zmingu.com/images/2025/09/02/image.webp)
```cpp
// 使用引用(&)可以避免复制整个向量，直接在原始数据上进行排序，效率更高。
void bubbleSort(std::vector<int>& v) {
    // 获取向量 v 的大小（元素个数），并存储在变量 n 中，方便后续循环使用
    int n = v.size();

    // 外层循环：控制排序的总趟数 (Passes)。
    // 对于 n 个元素，最多需要进行 n-1 趟排序即可完成。
    // 每完成一趟，未排序部分中的最大元素就会被移动到其最终位置。
    // 变量 i 代表已经完成的趟数，也代表数组末尾有多少个元素已经就位。
    for (int i = 0; i < n - 1; i++) {

        // 内层循环：在每一趟中，从头开始对相邻元素进行比较和交换。
        // j < n - i - 1 是一个关键的优化：
        // 1. j < n - 1: 因为我们比较的是 v[j] 和 v[j+1]，所以 j 的最大索引只能是 n-2，以防止 v[j+1] 越界。
        // 2. -i: 因为经过 i 趟排序后，数组末尾的 i 个元素已经是最大且排好序的，所以内层循环无需再比较它们。
        for (int j = 0; j < n - i - 1; j++) {

            // 比较相邻的两个元素。
            // 如果前一个元素 v[j] 大于后一个元素 v[j+1]（即逆序），则需要交换它们。
            if (v[j] > v[j + 1]) {

                // 调用标准库中的 swap 函数，交换 v[j] 和 v[j+1] 的位置。
                // 这个操作就是“冒泡”的核心：较大的元素像气泡一样向右“上浮”。
                std::swap(v[j], v[j + 1]);
            }
        }
    }
}
```
{{< /details >}}

{{< details summary="②选择排序（Selection Sort）" >}}
- 核心思想 : 在每一次的迭代中，从当前还未排序的元素中找到最值（最大或最小的那个），然后将它与未排序部分的第一个（或最后一个）元素交换位置。
![dsfalifjakfjsadf.gif](https://s3.zmingu.com/images/2025/09/02/dsfalifjakfjsadf.webp)
```cpp
void selectSort(vector<int>& v){
	int n = v.size();
	// 外层循环控制总的趟数，从 i=0 到 n-2，总共 n-1 趟。
	// 每完成一趟，就有一个元素被正确放置到最终位置。
	// i 代表数组末尾已经有多少个元素被排好序了。
	for(int i=0;i<n-1;i++){

		// ---- 以下是单趟排序的核心逻辑 ----
		// 任务：在 v[0...n-1-i] 这个未排序区间里，找到最大值的索引。

		int index = 0; // 假设未排序区间的第一个元素(v[0])是最大的
		
		// 内层循环遍历整个未排序区间 v[1...n-1-i]
		for(int j=1;j<n-i;j++){
			// 如果发现了比当前记录的最大值 v[index] 更大的元素 v[j]
			if(v[j] > v[index]){
				index = j; // 更新最大值的索引
			}
		}
		// 内层循环结束后，index 就指向了整个未排序区间的最大元素的索引。

		// 将找到的最大值 (v[index]) 与未排序区间的最后一个元素 (v[n-1-i]) 进行交换。
		// 这样，当前未排序区间的最大值就被放到了它最终应该在的位置。
		swap(v[index], v[n-1-i]);
	}
}
```
{{< /details >}}

{{< details summary="③插入排序（Insertion Sort）" >}}
- 核心思想 : 将整个数组看作两个部分：一个是有序区，另一个是无序区。每次从无序区中取出一个元素，然后在有序区中从后向前扫描，找到合适的位置并将其插入。
![insertionsort.gif](https://s3.zmingu.com/images/2025/09/02/insertionsort.webp)
```cpp
void insertSort(vector<int>& v){
	int n = v.size();

	// 外层循环：从第二个元素开始（索引i=1），逐个遍历整个数组。
	// i 是当前待插入元素的索引。
	// 循环结束后，v[0...i] 这个子数组会变得有序。
	for(int i=1; i<n; i++){

		// ---- 以下是 “寻找位置并插入” 的核心逻辑 ----

		// 内层循环：负责为 v[i] 在其左边的有序区 v[0...i-1] 中找到正确的位置。
		// j 从当前待插入元素的索引 i 开始，向前移动（j--）。
		for(int j=i; j>0; j--){
			
			// 比较待插入元素 v[j] 和它前面的元素 v[j-1]。
			if(v[j] < v[j-1]){
				// 如果待插入元素 v[j] 更小，说明还没找到正确位置，
				// 就将它和前面的元素交换，相当于 v[j] 向前移动了一步。
				swap(v[j], v[j-1]);
			}
			// 如果待插入元素 v[j] 不比它前面的元素 v[j-1] 小了
			else{
				// 这意味着 v[j] 已经找到了它在有序区中的正确位置，
				// 因为 v[0...j-1] 本身就是有序的。
				// 所以内层循环没有必要再继续向前比较了，直接中断。
				// 这个 break 是一个重要的优化。
				break;
			}
		}
	}
}
```
{{< /details >}}

{{< details summary="④希尔排序（Shell Sort）" >}}
- 核心思想 : 又叫缩小增量排序算法 , 引入一个“**增量**”或“**步长**”（Gap）的概念
- - **预排序阶段（增量 > 1）**:
    - 选择一个增量序列（比如 `n/2`, `n/4`, ..., `1`）。
    - 对于每一个增量 `gap`，将数组中所有间隔为 `gap` 的元素视为一个子序列（例如，`arr[0], arr[gap], arr[2*gap], ...` 构成一个子序列）。
    - 对这些子序列分别进行插入排序。这个过程能让一些距离很远的元素快速移动到它们大致正确的位置。
- **收尾阶段（增量 = 1）**:
    - 当增量减小到 `1` 时，整个数组被视为一个组。
    - 此时进行一次完整的插入排序。由于经过了前面的预排序，数组已经接近有序，所以这次排序的效率非常高。
![shellsortgif.gif](https://s3.zmingu.com/images/2025/09/02/shellsortgif.webp)

```cpp
void shellSort(int *arr, int size) {
    int i, j, tmp, increment;
    
    // 外层循环：控制增量(increment)的递减。
    // 从 size/2 开始，每次减半，直到增量为1。
    // 这就是递减增量序列的实现。
    for (increment = size / 2; increment > 0; increment /= 2) {
        
        // 中层循环：从第 increment 个元素开始，遍历所有元素。
        // 对于给定的增量，这个循环实际上是在遍历每一个分组的成员。
        // i 是当前待插入元素的索引。
        for (i = increment; i < size; i++) {
            
            // 下面的代码块是一个标准的“插入排序”逻辑，
            // 只不过比较和移动的步长不是1，而是 increment。
            
            tmp = arr[i]; // 暂存待插入的元素
            
            // 内层循环：在当前元素所在的分组中（即所有间隔为increment的元素），
            // 为 arr[i] 寻找正确的插入位置。
            // j 从 i - increment 开始，向前以 increment 为步长进行扫描。
            // 条件：j没有越界 并且 待插入的元素tmp小于当前比较的元素arr[j]。
            for (j = i - increment; j >= 0 && tmp < arr[j]; j -= increment) {
                // 将 arr[j] 向后移动 increment 个位置，为 tmp 腾出空间。
                arr[j + increment] = arr[j];
            }
            // 循环结束后，j+increment 就是 tmp 应该插入的位置。
            arr[j + increment] = tmp;
        }
    }
}
```
{{< /details >}}

{{< details summary="⑤归并排序（Merge Sort）" >}}
- 核心思想 : 首先将数组**递归地对半拆分**，直到每个子数组只剩下一个元素（天然有序），然后再将这些有序的子数组**两两合并**，最终形成一个完全有序的数组。

![mergesort.gif](https://s3.zmingu.com/images/2025/09/02/mergesort.webp)

```cpp
#include <iostream>
#include <vector>

// 辅助函数：用于打印 vector 中的内容
void printVector(const std::vector<int>& v) {
    for (int num : v) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
}

/**
 * @brief 合并函数：将两个相邻的有序子数组合并成一个大的有序数组
 * @param v     要操作的原始向量的引用
 * @param left  左边有序子数组的起始索引
 * @param mid   左边有序子数组的结束索引 (同时 mid+1 是右边子数组的起始)
 * @param right 右边有序子数组的结束索引
 */
void merge(std::vector<int>& v, int left, int mid, int right) {
    // 创建一个临时的向量副本，用于读取数据，避免在写入原数组时发生数据冲突
    std::vector<int> temp = v;

    // 初始化三个指针：
    // i 指向左边子数组的开始
    // j 指向右边子数组的开始
    // index 指向原始向量 v 中将要被填充的位置
    int i = left;
    int j = mid + 1;
    int index = left;

    // 当两个子数组中至少还有一个没有遍历完时，循环继续
    while (i <= mid || j <= right) {
        // 情况一：如果左边子数组已经遍历完毕，直接将右边子数组剩余的元素复制过来
        if (i > mid) {
            v[index++] = temp[j++];
        }
        // 情况二：如果右边子数组已经遍历完毕，直接将左边子数组剩余的元素复制过来
        else if (j > right) {
            v[index++] = temp[i++];
        }
        // 情况三：比较两个子数组当前的元素，将较小的那个放入原始数组 v
        else if (temp[i] < temp[j]) {
            v[index++] = temp[i++];
        }
        // 情况四：右边子数组的元素小于或等于左边的，将其放入原始数组 v
        else {
            v[index++] = temp[j++];
        }
    }
}

/**
 * @brief 归并排序的递归实现函数 (核心逻辑)
 * @param v     要操作的原始向量的引用
 * @param left  当前要排序的区间的左边界
 * @param right 当前要排序的区间的右边界
 */
void merge_Sort(std::vector<int>& v, int left, int right) {
    // 递归的终止条件：当区间只有一个元素或没有元素时，它自然是有序的
    if (left >= right) {
        return;
    }

    // --- 分解 (Divide) ---
    // 计算中间位置，将当前区间一分为二
    int mid = left + (right - left) / 2; // 使用这种方式防止 (left+right) 溢出

    // 递归地对左半部分进行排序
    merge_Sort(v, left, mid);
    // 递归地对右半部分进行排序
    merge_Sort(v, mid + 1, right);

    // --- 合并 (Merge/Conquer) ---
    // 这是一个优化：如果左子数组的最大值(v[mid])已经小于等于右子数组的最小值(v[mid+1])，
    // 说明整个区间已经是有序的了，无需执行耗时的 merge 操作。
    if (v[mid] > v[mid + 1]) {
        merge(v, left, mid, right);
    }
}

/**
 * @brief 归并排序的主函数 (用户调用的入口)
 * @param v 要排序的向量的引用
 */
void mergeSort(std::vector<int>& v) {
    if (v.empty()) {
        return;
    }
    int n = v.size();
    // 从整个数组的范围开始进行递归排序
    merge_Sort(v, 0, n - 1);
}

// 主函数，用于测试排序算法
int main() {
    std::vector<int> numbers = {38, 27, 43, 3, 9, 82, 10};

    std::cout << "Original array: ";
    printVector(numbers);

    // 调用归并排序
    mergeSort(numbers);

    std::cout << "Sorted array:   ";
    printVector(numbers);

    return 0;
}
```
{{< /details >}}

{{< details summary="⑥快速排序（Quick Sort）" >}}
- 核心思想 : 
- **挑选基准 (Pivot)**: 从数组中挑选一个元素作为“基准”或“枢轴”。这个基准的选择会影响效率，但最简单的实现就是选择第一个或最后一个元素。
- **分区 (Partition)**: 重新排列数组。将所有比基准值小的元素移动到基准的左边，所有比基准值大的元素移动到基准的右边。相等的元素可以放在任意一边。完成这一步后，基准元素就位于其最终排序后的正确位置。
- **递归 (Recursion)**: 对基准左边的子数组和右边的子数组，分别重复步骤1和2，直到子数组的大小为0或1（即已经天然有序）。
![quicksort.gif](https://s3.zmingu.com/images/2025/09/02/quicksort.webp)

```cpp
// 快速排序的递归函数
// 对 v 数组中从索引 left 到 right 的部分进行排序
void quick_Sort(vector<int>& v, int left, int right){
	// 递归的出口：如果子数组只有一个元素或为空，则自然有序，直接返回
	if(left >= right) return;

	// ---- 以下是“分区”(Partition)操作的核心 ----
	
	// 1. 挑选基准
	int i = left, j = right;
	int base = v[left];  // 选择子数组最左边的数为基准值

	// 当左右两个指针 i 和 j 没有相遇时，持续进行分区操作
	while(i < j){
		// 从右向左找：找到第一个小于基准值(base)的数
		// 只要 v[j] 大于等于 base，就继续向左移动 j 指针
		while(v[j] >= base && i < j){
			j--;
		}
		// 从左向右找：找到第一个大于基准值(base)的数
		// 只要 v[i] 小于等于 base，就继续向右移动 i 指针
		while(v[i] <= base && i < j){
			i++;
		}
		// 如果两个指针还没相遇，说明在 j 的位置找到了一个“小数”，在 i 的位置找到了一个“大数”
		if(i < j){
			// 交换这两个数，把小数换到左边，大数换到右边
			swap(v[i], v[j]);
		}
	} 
	// 循环结束后，i 和 j 相遇 (i == j)。这个位置是基准值应该在的地方。
	// 将最初的基准值（我们一直把它存在变量 base 里）和相遇位置的元素交换。
	// 注意：代码中 v[left] = v[i] 和 v[i] = base 是一种交换方式，更标准的写法是 swap(v[left], v[i])
	v[left] = v[i];
	v[i] = base;

	// ---- 分区操作结束，基准值 v[i] 已就位 ----

	// 3. 递归处理
	// 对基准左边的子数组进行快速排序
	quick_Sort(v, left, i - 1);
	// 对基准右边的子数组进行快速排序
	quick_Sort(v, i + 1, right);
}

// 快速排序的入口函数
void quickSort(vector<int>& v){
	int n = v.size();
	// 初始调用，对整个数组进行排序
	quick_Sort(v, 0, n - 1);
}
```
{{< /details >}}

{{< details summary="⑦堆排序（Heap Sort）" >}}
 - 将初始待排序关键字序列(R1,R2….Rn)构建成大顶堆，此堆为初始的无序区；
 - 将堆顶元素R[1]与最后一个元素R[n]交换，此时得到新的无序区(R1,R2,……Rn-1)和新的有序区(Rn),且满足R[1,2…n-1]<=R[n]；
 - 由于交换后新的堆顶R[1]可能违反堆的性质，因此需要对当前无序区(R1,R2,……Rn-1)调整为新堆，然后再次将R[1]与无序区最后一个元素交换，得到新的无序区(R1,R2….Rn-2)和新的有序区(Rn-1,Rn)。不断重复此过程直到有序区的元素个数为n-1，则整个排序过程完成。
![heapsort.gif](https://s3.zmingu.com/images/2025/09/02/heapsort.webp)

```cpp
#include <iostream>

// 辅助函数：交换数组中两个元素的位置
// (您的原始代码中调用了swap，但未提供定义，这里补充一个)
void swap(int tree[], int i, int j) {
    int temp = tree[i];
    tree[i] = tree[j];
    tree[j] = temp;
}

// 辅助函数：打印数组内容
void printArray(int arr[], int n) {
    for (int i = 0; i < n; ++i)
        std::cout << arr[i] << " ";
    std::cout << "\n";
}


/**
 * @brief 核心调整函数 (sift down / 下沉)
 * 用于维护最大堆的性质。假设一个节点的左右子树都已经是最大堆，
 * 此函数可以保证以该节点为根的整棵树也满足最大堆性质。
 * @param tree 存储堆的数组
 * @param n    堆中元素的数量 (不是数组总大小，在排序阶段会变化)
 * @param i    当前需要调整的子树的根节点下标
 */
void heapify(int tree[], int n, int i) {
    // 递归出口或安全检查：如果节点索引超出范围，则返回
    if (i >= n) return;

    // 计算当前节点的左右子节点下标
    // 在数组表示的完全二叉树中，节点i的左子节点为 2*i + 1，右子节点为 2*i + 2
    int left = 2 * i + 1;
    int right = 2 * i + 2;

    // 假设当前父节点 i 的值最大
    int max_index = i;

    // 检查左子节点是否存在，并且其值是否大于当前最大值
    if (left < n && tree[left] > tree[max_index]) {
        // 如果是，则更新最大值节点的索引
        max_index = left;
    }

    // 检查右子节点是否存在，并且其值是否大于当前最大值
    if (right < n && tree[right] > tree[max_index]) {
        // 如果是，则更新最大值节点的索引
        max_index = right;
    }

    // 如果经过比较后，发现最大值的节点不是父节点 i
    if (max_index != i) {
        // 将父节点 i 与其最大的子节点交换
        swap(tree, max_index, i);
        // 交换后，原来位于 max_index 的较小值被换到了下面，
        // 这可能会破坏以 max_index 为根的子树的最大堆性质。
        // 因此，需要对这个子树进行递归的 heapify 调用，继续向下调整。
        heapify(tree, n, max_index);
    }
}

/**
 * @brief 将一个无序数组构建成一个最大堆 (Max Heap)
 * @param tree 待建堆的数组
 * @param n    数组的长度
 */
void build_heap(int tree[], int n) {
    // 找到最后一个非叶子节点。
    // 在完全二叉树中，最后一个节点是 n-1，其父节点就是 (n-1 - 1) / 2 = n/2 - 1。
    // 所有叶子节点天然满足堆的性质，所以我们从最后一个非叶子节点开始调整。
    int last_non_leaf = (n - 2) / 2;

    // 从最后一个非叶子节点开始，自下而上，自右向左，对每个节点调用 heapify
    for (int i = last_non_leaf; i >= 0; i--) {
        heapify(tree, n, i);
    }
}

/**
 * @brief 堆排序主函数
 * @param tree 待排序的数组
 * @param n    数组的长度
 */
void heap_sort(int tree[], int n) {
    // --- 步骤一：建堆 ---
    // 首先，将整个无序数组构建成一个最大堆。
    // 完成后，数组的第一个元素 tree[0] 就是整个数组的最大值。
    build_heap(tree, n);

    // --- 步骤二：排序 ---
    // 循环地从堆中取出最大元素，放到数组的末尾。
    // i 是当前堆的最后一个元素的下标，也是未排序部分的边界。
    for (int i = n - 1; i >= 0; i--) {
        // 将堆顶元素（当前最大值 tree[0]）与当前堆的末尾元素 tree[i] 交换。
        // 这样，最大的元素就被放到了它最终应该在的位置。
        swap(tree, i, 0);

        // 交换后，堆顶的元素变了，破坏了最大堆的性质。
        // 同时，堆的大小减 1 (因为末尾元素已经排好序，不再属于堆)。
        // 所以，对大小为 i 的新堆，从根节点 0 开始，进行 heapify 调整，
        // 重新找出剩余元素中的最大值并放到堆顶。
        heapify(tree, i, 0);
    }
}


// 主函数，用于测试
int main() {
    int arr[] = {4, 10, 3, 5, 1, 9, 8};
    int n = sizeof(arr) / sizeof(arr[0]);

    std::cout << "Original array: ";
    printArray(arr, n);

    heap_sort(arr, n);

    std::cout << "Sorted array: ";
    printArray(arr, n);

    return 0;
}
```
{{< /details >}}

{{< details summary="算法复杂度" >}}
![UEIUDjugsj](https://s3.zmingu.com/images/2025/09/02/UEIUDjugsj.webp)
{{< /details >}}


[Hello 算法](https://www.hello-algo.com/)






























